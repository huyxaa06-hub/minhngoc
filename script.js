let packingData = JSON.parse(localStorage.getItem('packingData')) || [];

const form = document.getElementById('packingForm');
const itemCodeInput = document.getElementById('itemCode');
const itemQtyInput = document.getElementById('itemQty');
const editIndexInput = document.getElementById('editIndex');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const code = itemCodeInput.value.trim().toUpperCase();
    const qty = parseInt(itemQtyInput.value);
    const editIndex = editIndexInput.value;
    const now = new Date().toLocaleString('vi-VN');

    if (!code || isNaN(qty)) return;

    if (editIndex === "") {
        // Thêm mới (nếu mã đã tồn tại thì cộng dồn hoặc thêm mới tùy ý, ở đây cho phép trùng mã nhưng phân biệt dòng hoặc bạn có thể gộp)
        packingData.push({ code, qty, updatedAt: now });
    } else {
        // Chỉnh sửa
        packingData[editIndex] = { code, qty, updatedAt: now };
    }

    saveAndReset();
});

function renderTable() {
    const searchKeyword = document.getElementById('searchInput').value.toLowerCase();
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    let filteredData = packingData.filter(item => item.code.toLowerCase().includes(searchKeyword));
    
    let totalQuantity = 0;

    if (filteredData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-500">Không tìm thấy dữ liệu phù hợp</td></tr>`;
    }

    filteredData.forEach((item, index) => {
        // Tìm đúng index gốc trong mảng chính
        const originalIndex = packingData.indexOf(item);
        totalQuantity += item.qty;

        tableBody.innerHTML += `
            <tr class="hover:bg-slate-800/30 transition">
                <td class="p-4 text-slate-400">${originalIndex + 1}</td>
                <td class="p-4 font-medium text-slate-100">${item.code}</td>
                <td class="p-4 text-blue-400 font-semibold">${item.qty.toLocaleString()}</td>
                <td class="p-4 text-slate-400 text-xs">${item.updatedAt}</td>
                <td class="p-4 text-center space-x-2">
                    <button onclick="editItem(${originalIndex})" class="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 p-2 rounded-lg transition" title="Sửa">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onclick="deleteItem(${originalIndex})" class="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 p-2 rounded-lg transition" title="Xóa">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById('totalCodes').innerText = packingData.length;
    document.getElementById('totalQty').innerText = totalQuantity.toLocaleString();
}

function editItem(index) {
    const item = packingData[index];
    itemCodeInput.value = item.code;
    itemQtyInput.value = item.qty;
    editIndexInput.value = index;
    
    saveBtn.innerHTML = `<i class="fa-solid fa-check mr-2"></i>Cập Nhật`;
    cancelBtn.classList.remove('hidden');
    itemCodeInput.focus();
}

function deleteItem(index) {
    if (confirm("Bạn có chắc chắn muốn xóa mã hàng này không?")) {
        packingData.splice(index, 1);
        saveAndReset();
    }
}

function resetForm() {
    form.reset();
    editIndexInput.value = "";
    saveBtn.innerHTML = `<i class="fa-solid fa-floppy-disk mr-2"></i>Lưu`;
    cancelBtn.classList.add('hidden');
}

function saveAndReset() {
    localStorage.setItem('packingData', JSON.stringify(packingData));
    resetForm();
    renderTable();
}

// Chạy lần đầu khi load trang
renderTable();
