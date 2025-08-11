import * as XLSX from 'xlsx';

export interface CSVRow {
  firstName: string;
  phone: string;
  notes: string;
}

export function parseCSVFile(buffer: Buffer, filename: string): CSVRow[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  if (jsonData.length === 0) {
    throw new Error('File is empty');
  }

  const headers = jsonData[0] as string[];
  const rows = jsonData.slice(1) as any[][];

  const firstNameIndex = headers.findIndex(h => 
    h.toLowerCase().includes('firstname') || h.toLowerCase().includes('first name')
  );
  const phoneIndex = headers.findIndex(h => 
    h.toLowerCase().includes('phone') || h.toLowerCase().includes('mobile')
  );
  const notesIndex = headers.findIndex(h => 
    h.toLowerCase().includes('notes') || h.toLowerCase().includes('note')
  );

  if (firstNameIndex === -1 || phoneIndex === -1) {
    throw new Error('Required columns (FirstName, Phone) not found in file');
  }

  const parsedData: CSVRow[] = [];
  
  for (const row of rows) {
    if (row.length === 0 || !row[firstNameIndex] || !row[phoneIndex]) {
      continue;
    }

    parsedData.push({
      firstName: String(row[firstNameIndex] || '').trim(),
      phone: String(row[phoneIndex] || '').trim(),
      notes: notesIndex !== -1 ? String(row[notesIndex] || '').trim() : ''
    });
  }

  if (parsedData.length === 0) {
    throw new Error('No valid data rows found in file');
  }

  return parsedData;
}

export function distributeTasksAmongAgents(tasks: CSVRow[], agentIds: string[], uploadId: string, userId?: string) {
  if (agentIds.length !== 5) {
    throw new Error('Exactly 5 agents are required for task distribution');
  }

  const distributedTasks = [];
  const tasksPerAgent = Math.floor(tasks.length / 5);
  const remainingTasks = tasks.length % 5;

  let taskIndex = 0;

  for (let i = 0; i < 5; i++) {
    const agentTaskCount = tasksPerAgent + (i < remainingTasks ? 1 : 0);
    
    for (let j = 0; j < agentTaskCount; j++) {
      if (taskIndex < tasks.length) {
        distributedTasks.push({
          ...tasks[taskIndex],
          agentId: agentIds[i],
          uploadId,
          ...(userId && { userId })
        });
        taskIndex++;
      }
    }
  }

  return distributedTasks;
}