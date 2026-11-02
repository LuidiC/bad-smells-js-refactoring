const STANDARD_USER_VALUE_LIMIT = 500;
const ADMIN_PRIORITY_THRESHOLD = 1000;

function createHeader(reportType, user) {
  if (reportType === 'CSV') return 'ID,NOME,VALOR,USUARIO\n';
  if (reportType === 'HTML') {
    return '<html><body>\n<h1>Relatório</h1>\n'
      + `<h2>Usuário: ${user.name}</h2>\n<table>\n`
      + '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n';
  }
  return '';
}

function canViewItem(user, item) {
  return user.role === 'ADMIN'
    || (user.role === 'USER' && item.value <= STANDARD_USER_VALUE_LIMIT);
}

function updatePriority(user, item) {
  if (user.role === 'ADMIN' && item.value > ADMIN_PRIORITY_THRESHOLD) {
    item.priority = true;
  }
}

function createRow(reportType, user, item) {
  if (reportType === 'CSV') {
    return `${item.id},${item.name},${item.value},${user.name}\n`;
  }
  if (reportType === 'HTML') {
    const style = user.role === 'ADMIN' && item.priority ? ' style="font-weight:bold;"' : '';
    return `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
  }
  return '';
}

function createFooter(reportType, total) {
  if (reportType === 'CSV') return `\nTotal,,\n${total},,\n`;
  if (reportType === 'HTML') return `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
  return '';
}

export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  generateReport(reportType, user, items) {
    const header = createHeader(reportType, user);
    let body = '';
    let total = 0;

    for (const item of items) {
      updatePriority(user, item);
      if (!canViewItem(user, item)) continue;
      const row = createRow(reportType, user, item);
      if (!row) continue;
      body += row;
      total += item.value;
    }

    return (header + body + createFooter(reportType, total)).trim();
  }
}
