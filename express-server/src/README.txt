DIRECTORY STRUCTURE (cấu trúc thư mục)
bin\            #Thư mục thiết lập cấu hình (cors - phạm vi truy cập đến server,giao thức http, port),server khởi tạo - lắng nghe (create - listen), 
                #Khởi tạo realtime với socket.io
public\         #Thư mục được khai báo trong app.js, là nơi chứa các files (jpg, mp3, mp4, css, js, font) mà client có thể truy cập để tải về mà không cần xác thực người dùng ví dụ như hình ảnh sản phẩm
src\            #Chứa source code chính của project
 |--config\ or constant\    # Environment variables and configuration related things - chứa  các biến môi trường dùng chung cho cả project như
 |--controllers\            # Route controllers (controller layer) - Các tuyến điều khiển như CRUD(thêm- sửa - xoá - lấy user)
 |--middlewares\            # Custom express middlewares - các middlewares như validate, auth
 |--models\                 # Mongoose models (data layer) - validate data và bộ lọc data sau khi được truy vấn ra
 |--routes\                 # Routes - Nhận request, xử lý và trả kết quả về cho client
 |--services\               # Business logic (service layer) - các dịch vụ gửi email, auth, token, thêm sửa xoá user
 |--utils\                  # Utility classes and functions - các hàm tiện ích dùng chung cho các mục khác
 |--validations\            # Request data validation schemas - Chứa các hàm kiểm tra kiểu dữ liệu của request
 |--app.js                  # Express app - Khai báo sử dụng các packet, routes, cors, middlewares Auth
 |--index.js                # App entry point - điểm vào ứng dụng