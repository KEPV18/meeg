// مفتاح ال API الخاص بك
const apiKey = "AIzaSyA1DiDSTDT-E1KtlFhUpeecLxnKh_Uxxf8";
// رقم الشيت
const sheetId = "1uIq-o9hWSlolTnYop9nMNtKRCduGcJ8AjawnQ4JgrRQ";

function search() {
  const searchValue = document.getElementById("searchInput").value;
  const selectedSheet = document.getElementById("sheetDropdown").value;

  // إضافة "ME" إلى القيمة المدخلة
  const formattedSearchValue = `ME${searchValue}`;

  // استدعاء الوظيفة للبحث وعرض النتائج
  searchSheet(formattedSearchValue, selectedSheet);
}

async function populateSheetDropdown() {
  const dropdown = document.getElementById("sheetDropdown");
  
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`);
    const data = await response.json();

    // تعبئة القائمة المنسدلة بأسماء الأوراق
    data.sheets.forEach(sheet => {
      const option = document.createElement("option");
      option.value = sheet.properties.title;
      option.textContent = sheet.properties.title;
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching sheet data:", error);
  }
}

async function searchSheet(searchValue, selectedSheet) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${selectedSheet}?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    const resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = ''; // مسح النتائج السابقة

    // بحث في البيانات
    const results = data.values.filter(row => row.includes(searchValue));

    if (results.length > 0) {
      let sum = 0;

      results.forEach(result => {
        result.forEach(value => {
          const num = parseFloat(value);

          if (!isNaN(num) && num <= 8) {
            // إذا كانت القيمة هي رقم وأقل من أو تساوي 8
            sum += num;
          }
        });
      });

      // عرض المجموع
      resultContainer.innerHTML = `<p>Total Delay: ${sum}</p>`;
    } else {
      resultContainer.innerHTML = '<p>No results found.</p>';
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// تعبئة القائمة المنسدلة عند تحميل الصفحة
window.onload = function() {
  populateSheetDropdown();
}



const tableBody1 = document.getElementById("tableBody1");
const tableBody2 = document.getElementById("tableBody2");

async function searchNumber() {
  const userNumber = document.getElementById("userNumber").value;
  const id = `ME${userNumber}@meti.ai`;

  tableBody1.innerHTML = ''; // Clear Table 1
  tableBody2.innerHTML = ''; // Clear Table 2

  const sheetsNames1 = await getSheets('1');
  const sheetsNames2 = await getSheets('2');

  await Promise.all(sheetsNames1.map(async (curSheet) => {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/1idy2I6-yhacTR_EeVWZg0yR8QdSZB6Zh_wa20cVZfxM/values/${curSheet}?key=AIzaSyA1DiDSTDT-E1KtlFhUpeecLxnKh_Uxxf8`
    );
    const data = await res.json();
    displayTableData(data, tableBody1, curSheet, id);
  }));

  await Promise.all(sheetsNames2.map(async (curSheet) => {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/1jN-nbNJxWyFadRCEOMV7GnP9WX1lN2nOmh8CliQgn_Q/values/${curSheet}?key=AIzaSyA1DiDSTDT-E1KtlFhUpeecLxnKh_Uxxf8`
    );
    const data = await res.json();
    displayTableData(data, tableBody2, curSheet, id);
  }));
}

async function getSheets(page) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${getSpreadsheetKey(page)}/?key=AIzaSyA1DiDSTDT-E1KtlFhUpeecLxnKh_Uxxf8`
  );
  const data = await res.json();
  const sheetsNames = data.sheets.map((sheet) => ({
    title: encodeURIComponent(sheet.properties.title),
    index: parseInt(sheet.properties.title.split("/").pop()) || 0
  }));

  sheetsNames.sort((a, b) => {
    const dateA = extractDateFromSheetName(a.title);
    const dateB = extractDateFromSheetName(b.title);
    return dateA - dateB;
  });

  return sheetsNames.map(sheet => sheet.title);
}

function extractDateFromSheetName(sheetName) {
  const match = sheetName.match(/(\d{1,2})\/(\d{1,2})/);
  if (match) {
    const month = parseInt(match[1]);
    const day = parseInt(match[2]);
    return new Date(new Date().getFullYear(), month - 1, day);
  }
  return null;
}

function getSpreadsheetKey(page) {
  return (page === '1') ? '1BoiSAc9OnuyFw5JGWPTmIj2CKaAI3miiB5Nm-qmdl0M' : '13WWnUUVma3OB38OFS2BiRGsAk500rqgMXWiHMhNFCmo';
}

function getSheetNumber(sheetName) {
  const match = sheetName.match(/(\d{1,2})\/(\d{1,2})/);
  if (match) {
    return match[2] + '/' + match[1];
  }
  return null;
}

function displayTableData(data, tableBody, curSheet, id) {
  const myIdRow = data.values.find((row) => row.includes(id));

  if (myIdRow) {
    const sheetName = curSheet.replace(/%2(\d|[A-Z])/g, "/");
    const sheetNameParts = sheetName.match(/(\d{1,2}\/\d{1,2})$/);
    const simplifiedSheetName = sheetNameParts ? sheetNameParts[1] : sheetName;

    myIdRow.slice(7).forEach((item, i) => {
      if (item !== undefined && item !== null && item !== "" && item !== "undefined(FP)" && item !== "0") {
        const row = document.createElement("tr");

        const sheetNameCell = document.createElement("td");
        sheetNameCell.textContent = simplifiedSheetName;
        row.appendChild(sheetNameCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = (data.values[0][i + 7] !== "" && data.values[0][i + 7] + "(FP)") ||
          (data.values[0][i + 6] !== "" && "NO. labels FP") ||
          (data.values[0][i + 5] !== "" && data.values[0][i + 5] + "(QA)") ||
          (data.values[0][i + 4] !== "" && "NO. labels QA");
        row.appendChild(nameCell);

        const valueCell = document.createElement("td");
        valueCell.textContent = item;
        row.appendChild(valueCell);

        tableBody.appendChild(row);
      }
    });
  }
}
