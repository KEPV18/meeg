// استبدل مفتاح API الخاص بك
const auth = {
    key: 'AIzaSyA1DiDSTDT-E1KtlFhUpeecLxnKh_Uxxf8',
  };
  
  // حدد أوراق جوجل التي تريد البحث فيها
  const sheets = ['sheet1', 'sheet2', 'sheet3'];
  
  // دالة البحث
  function searchData(query) {
    // استدعاء Google Sheets API
    gapi.client.sheets.batchGet({
      auth,
      spreadsheetIds: sheets,
      ranges: ['A:Z'],
      q: query,
    }).then((response) => {
      // دمج النتائج
      const allResults = response.result.valueRanges.reduce((acc, curr) => acc.concat(curr.values), []);
  
      // عرض النتائج
      displayResults(allResults);
    });
  }
  
  // دالة عرض النتائج
  function displayResults(results) {
    // إزالة المحتوى الحالي من الجدول
    document.getElementById('results').innerHTML = '';
  
    // إنشاء جدول لعرض النتائج
    const table = document.createElement('table');
    table.setAttribute('width', '100%');
    table.setAttribute('border', '1');
    table.setAttribute('cellspacing', '0');
    table.setAttribute('cellpadding', '5');
  
    // إنشاء صفوف الجدول
    results.map((row) => {
      const tr = document.createElement('tr');
      row.forEach((cell) => {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
  
    // إضافة الجدول إلى الصفحة
    document.getElementById('results').appendChild(table);
  }
  
  // ربط دالة searchData مع حدث الضغط على زر البحث
  const searchButton = document.getElementById('search-button');
  
  searchButton.addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    searchData(query);
  });
  
  // تهيئة مكتبة Google Sheets API
  gapi.load('client', () => {
    gapi.client.init({
      apiKey: auth.key,
    }).then(() => {
      console.log('Google Sheets API is ready.');
    });
  });
  