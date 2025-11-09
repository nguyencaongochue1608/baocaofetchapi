// file: js/app.js
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const getButton = document.getElementById('get-data-btn');
const postForm = document.getElementById('post-form');
const resultsContainer = document.getElementById('results-container');
const statusMessage = document.getElementById('status-message');
const postButton = document.getElementById('post-btn');

// --- HÀM LẤY DỮ LIỆU (GET) ---
async function fetchData() {
    statusMessage.className = "alert alert-warning";
    statusMessage.textContent = "Đang tải dữ liệu...";
    resultsContainer.innerHTML = '';
    getButton.disabled = true; // Vô hiệu hóa nút khi đang tải

    try {
        // Gửi yêu cầu GET (chỉ giới hạn 10 mục)
        const response = await fetch(`${API_URL}?_limit=10`);

        // Kiểm tra lỗi HTTP (4xx hoặc 5xx)
        if (!response.ok) {
            throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
        }

        // Chuyển đổi Response Body thành JSON
        const data = await response.json(); 
        
        // Hiển thị dữ liệu lên UI
        renderData(data);

        statusMessage.className = "alert alert-success";
        statusMessage.textContent = `Tải thành công ${data.length} bài viết.`;

    } catch (error) {
        // Bắt lỗi mạng hoặc lỗi throw ở trên
        statusMessage.className = "alert alert-danger";
        statusMessage.textContent = `LỖI: Không thể kết nối hoặc Server bị lỗi. Chi tiết: ${error.message}`;
        console.error("Fetch Error:", error);
    } finally {
        getButton.disabled = false; // Luôn mở lại nút sau khi hoàn thành
    }
}

// --- HÀM HIỂN THỊ DỮ LIỆU ---
function renderData(data) {
    if (data.length === 0) {
        resultsContainer.innerHTML = '<p class="text-muted">Không tìm thấy dữ liệu.</p>';
        return;
    }
    
    data.forEach(item => {
        resultsContainer.innerHTML += `
            <div class="col-sm-12 col-md-6 mb-3">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted">ID: ${item.id} | User: ${item.userId}</h6>
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.body.substring(0, 150)}...</p>
                    </div>
                </div>
            </div>
        `;
    });
}

// --- HÀM GỬI DỮ LIỆU (POST) ---
async function postData(event) {
    event.preventDefault(); // Ngăn form gửi đi theo cách truyền thống
    postButton.disabled = true;
    
    const title = document.getElementById('post-title').value;
    const body = document.getElementById('post-body').value;
    
    const postObject = {
        title: title,
        body: body,
        userId: 99, // ID người dùng mẫu
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST', // Xác định phương thức POST
            headers: {
                'Content-Type': 'application/json', // Cấu hình Header
            },
            body: JSON.stringify(postObject), // Chuyển đổi Object thành chuỗi JSON
        });

        const result = await response.json();
        
        // Thông báo cho người dùng
        alert(`POST thành công! Dữ liệu được tạo với ID MỚI (Server Mockup): ${result.id}\nTiêu đề: ${result.title}`);
        console.log('Server response after POST:', result);

    } catch (error) {
        alert(`Lỗi khi gửi POST: ${error.message}`);
        console.error('POST Error:', error);
    } finally {
        postButton.disabled = false;
    }
}

// --- GẮN SỰ KIỆN ---
getButton.addEventListener('click', fetchData);
postForm.addEventListener('submit', postData);

// Khởi tạo trạng thái ban đầu
statusMessage.textContent = "Sẵn sàng. Nhấn 'Lấy 10 Bài Viết (GET)' để bắt đầu.";