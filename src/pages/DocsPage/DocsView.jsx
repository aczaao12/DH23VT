import React from 'react';
import Tabs from '../../components/shared/Tabs'; // Assuming Tabs component exists
import './DocsView.css'; // Import the new CSS file
import { Link } from "react-router-dom";
const DocsView = () => {
  const userGuideContent = (
    <div className="docs-content-wrapper">
      <h2>Hướng dẫn người dùng</h2>

      <h3>1. Đăng nhập</h3>
      <ul>
        <li><strong>Truy cập:</strong> Mở trình duyệt và truy cập vào địa chỉ web của ứng dụng. Sau đó login bằng nút có logo Google</li>
                <li><strong>Lưu ý tránh lỗi:</strong>
          <ul>
                        <li>Chỉ cho phép login bằng tài khoản của trường. VD: <strong>@st.hcmuaf.edu.vn</strong>  </li>
          </ul>
        </li>
      </ul>

      <h3>2. Dashboard (<Link to="/dashboard">Trang chính</Link>)</h3>
      <p>Trang Dashboard là nơi bạn có thể xem thông tin tổng quát về các hoạt động và điểm rèn luyện của mình.</p>
      <ul>
        <li><strong>Tóm tắt hoạt động và điểm rèn luyện:</strong> Hiển thị tổng số hoạt động đã nộp, tổng điểm cộng đã được duyệt và điểm rèn luyện cuối cùng của bạn.</li>
        <li><strong>Chọn học kỳ:</strong> Sử dụng hộp chọn "Select Semester" để xem dữ liệu hoạt động và điểm rèn luyện của học kỳ mong muốn.</li>
        <li><strong>Tìm kiếm hoạt động:</strong> Sử dụng thanh tìm kiếm "Search activities..." để lọc danh sách hoạt động theo tên.</li>
        <li><strong>Bảng điểm rèn luyện qua các kỳ:</strong> Nhấp vào tiêu đề "Điểm rèn luyện qua các kỳ" để xem điểm rèn luyện của bạn qua các học kỳ khác nhau.</li>
        <li><strong>Xem chi tiết hoạt động:</strong> Nhấp vào bất kỳ thẻ hoạt động nào để xem thông tin chi tiết (thời gian nộp, tên, điểm cộng, tệp đã tải lên, trạng thái duyệt). Nhấp "View File" để xem tệp đã tải lên.</li>
        <li><strong>Lưu ý tránh lỗi:</strong>
          <ul>
            <li>Nếu không thấy dữ liệu, hãy kiểm tra lại học kỳ đã chọn.</li>
            <li>Đảm bảo từ khóa tìm kiếm chính xác.</li>
          </ul>
        </li>
      </ul>

      <h3>3. Tải lên hoạt động (<Link to="/upload">Upload Page</Link>)</h3>
      <p>Trang này cho phép bạn nộp các hoạt động để nhận điểm rèn luyện.</p>
      <ol>
        <li><strong>Chọn học kỳ:</strong> Chọn học kỳ mà hoạt động này thuộc về.</li>
        <li><strong>Chọn tên hoạt động:</strong> Tìm và chọn hoạt động bạn đã tham gia. Điểm cộng tương ứng sẽ hiển thị.</li>
        <li><strong>Tải lên tệp:</strong> Nhấp "Choose File" để chọn tệp bằng chứng (ảnh, PDF) từ máy tính.</li>
        <li><strong>Gửi:</strong> Nhấp "Submit". Một cửa sổ xác nhận sẽ hiển thị tóm tắt.</li>
        <li><strong>Xác nhận:</strong> Kiểm tra lại thông tin và nhấp "Confirm" để hoàn tất.</li>
      </ol>
      <ul>
        <li><strong>Lưu ý tránh lỗi:</strong>
          <ul>
            <li>Chỉ tải lên các tệp bằng chứng hợp lệ (ảnh, PDF).</li>
            <li>Đảm bảo chọn đúng học kỳ và tên hoạt động để tránh sai sót điểm.</li>
            <li>Kiểm tra kích thước tệp, tránh tải lên tệp quá lớn có thể gây lỗi.</li>
          </ul>
        </li>
      </ul>

      <h3>4. Cài đặt (<Link to="/settings">Settings</Link>)</h3>
      <p>Trang Cài đặt cho phép bạn tùy chỉnh một số cài đặt ứng dụng và quản lý tài khoản.</p>
      <ul>
        <li><strong>Chế độ tối (Dark Mode):</strong> Bật/tắt chế độ tối để thay đổi giao diện màu sắc.</li>
        <li><strong>Đăng xuất (Sign out):</strong> Đăng xuất an toàn khỏi tài khoản của bạn.</li>
        <li><strong>Lưu ý tránh lỗi:</strong>
          <ul>
            <li>Đảm bảo bạn đã lưu mọi thay đổi trước khi đăng xuất.</li>
          </ul>
        </li>
      </ul>

      <h3>5. Công cụ tính điểm rèn luyện (<Link to="/calculator">Score Calculator</Link>)</h3>
      <p>Công cụ này giúp bạn ước tính điểm rèn luyện tối đa của mình dựa trên các tiêu chí nhất định.</p>
      <ol>
        <li><strong>Tiêu chí cộng điểm:</strong> Đánh dấu vào các hộp kiểm tương ứng với các tiêu chí bạn đã đạt được.</li>
        <li><strong>Hoạt động bắt buộc:</strong> Chọn "Có" hoặc "Không" cho câu hỏi "Bạn có tham gia Sinh hoạt Chi đoàn không?".</li>
        <li><strong>Tính điểm:</strong> Nhấp vào nút "Tính điểm rèn luyện".</li>
        <li>Kết quả điểm rèn luyện tối đa ước tính sẽ hiển thị.</li>
      </ol>
      <ul>
        <li><strong>Lưu ý tránh lỗi:</strong>
          <ul>
            <li>Kết quả chỉ là ước tính, điểm chính thức sẽ do trang <Link to="/dashboard">Dashboard</Link> công bố.</li>
            <li>Đảm bảo bạn đã chọn tất cả các tiêu chí phù hợp để có kết quả chính xác nhất.</li>
          </ul>
        </li>
      </ul>

      <h3>6. Thông báo (<Link to="/notifications">Notification Page</Link>)</h3>
      <p>Trang Thông báo hiển thị các thông báo và cập nhật quan trọng từ quản trị viên.</p>
      <ul>
        <li><strong>Xem danh sách thông báo:</strong> Các thông báo được hiển thị theo thứ tự thời gian, mới nhất ở trên cùng.</li>
        <li><strong>Xem toàn bộ nội dung:</strong> Nhấp "Show More" để mở rộng nội dung dài, "Show Less" để thu gọn.</li>
        <li><strong>Thích (Like) thông báo:</strong> Nhấp nút "Like" để thể hiện sự quan tâm.</li>
        <li><strong>Chia sẻ thông báo:</strong> Nhấp nút "Share" để chia sẻ thông báo qua các tùy chọn của thiết bị.</li>
        <li><strong>Lưu ý tránh lỗi:</strong>
          <ul>
            <li>Kiểm tra thường xuyên để không bỏ lỡ các thông báo quan trọng.</li>
          </ul>
        </li>
      </ul>

      <h3>7. Trang Docs (<Link to="/docs">Tài liệu hướng dẫn</Link>)</h3>
      <p>Trang bạn đang xem cung cấp các tài liệu hướng dẫn sử dụng ứng dụng.</p>
      <ul>
        <li><strong>Mục lục (TOC):</strong> Bên trái là mục lục giúp bạn điều hướng nhanh đến các phần khác nhau của tài liệu.</li>
        <li><strong>Cuộn và Highlight:</strong> Khi nhấp vào mục lục, trang sẽ tự động cuộn đến phần tương ứng và có highlight hoặc padding để dễ nhận biết.</li>
        <li><strong>Lưu ý tránh lỗi:</strong>
          <ul>
            <li>Nếu trang bị cuộn khó theo dõi, hãy sử dụng mục lục để nhảy đến phần bạn cần.</li>
          </ul>
        </li>
      </ul>
    </div>
  );

  const adminGuideContent = (
    <div className="docs-content-wrapper">
      <h2>Hướng dẫn quản trị viên</h2>

      <h3>1. Quyền truy cập quản trị viên (Admin Access)</h3>
      <ul>
        <li><strong>Điều kiện áp dụng:</strong> Chỉ các địa chỉ email đã được cấu hình là quản trị viên mới có thể truy cập các trang và tính năng quản trị.</li>
        <li><strong>Lưu ý tránh lỗi:</strong>
          <ul>
            <li>Nếu bạn là quản trị viên nhưng không thể truy cập, hãy kiểm tra lại địa chỉ email đã đăng nhập.</li>
            <li>Liên hệ với nhà phát triển nếu bạn tin rằng mình nên có quyền truy cập admin nhưng không được cấp.</li>
          </ul>
        </li>
      </ul>

      <h3>2. Quản lý hoạt động (Activity Management)</h3>
      <p>Tab "Quản lý hoạt động" là nơi chính để quản lý các hoạt động đã nộp của sinh viên.</p>
      <ul>
        <li><strong>Chọn học kỳ:</strong> Sử dụng hộp chọn "Select Semester" để xem và quản lý hoạt động của học kỳ mong muốn.</li>
        <li><strong>Lọc hoạt động:</strong> Sử dụng thanh tìm kiếm để lọc danh sách hoạt động theo tên.</li>
        <li><strong>Bảng hoạt động:</strong>
          <ul>
            <li><strong>Hành động cá nhân (Chỉnh sửa/Xóa):</strong>
              <ul>
                <li><strong>Chỉnh sửa:</strong> Nhấp vào một ô bất kỳ trong hàng để chỉnh sửa trực tiếp thông tin (trạng thái, điểm cộng, chi tiết). Nhấp ra ngoài hoặc nhấn Enter để lưu.</li>
                <li><strong>Xóa:</strong> Nhấp biểu tượng thùng rác để xóa hoạt động. Sẽ có cửa sổ xác nhận.</li>
              </ul>
            </li>
            <li><strong>Hành động hàng loạt (Cập nhật/Xóa):</strong>
              <ul>
                <li><strong>Chọn hoạt động:</strong> Đánh dấu hộp kiểm ở đầu mỗi hàng để chọn. Có thể chọn tất cả bằng hộp kiểm ở tiêu đề bảng.</li>
                <li><strong>Cập nhật hàng loạt:</strong> Chọn trạng thái mới từ "Bulk Update Status" và nhấp "Apply Status".</li>
                <li><strong>Xóa hàng loạt:</strong> Nhấp "Delete Selected" để xóa tất cả hoạt động đã chọn. Sẽ có cửa sổ xác nhận.</li>
              </ul>
            </li>
          </ul>
        </li>
        <li><strong>Quản lý dữ liệu:</strong>
          <ul>
            <li><strong>Xuất dữ liệu:</strong> Nhấp "Export Data" để tải xuống tệp JSON chứa dữ liệu hoạt động của học kỳ hiện tại.</li>
            <li><strong>Nhập dữ liệu:</strong> Chọn học kỳ muốn nhập, chọn tệp JSON và nhấp "Import Data".</li>
            <li><strong>Tạo báo cáo:</strong> Nhấp "Generate Report" để tạo báo cáo các hoạt động đã được phê duyệt. Nhấp "Copy Report" để sao chép báo cáo (HTML) vào clipboard.</li>
          </ul>
        </li>
        <li><strong>Lưu ý tránh lỗi:</strong>
          <ul>
            <li>Luôn xác nhận trước khi xóa hoạt động, đặc biệt là xóa hàng loạt.</li>
            <li>Đảm bảo tệp JSON nhập vào đúng định dạng để tránh lỗi dữ liệu.</li>
            <li>Kiểm tra kỹ học kỳ đã chọn trước khi nhập dữ liệu để tránh ghi đè hoặc nhập sai chỗ.</li>
          </ul>
        </li>
      </ul>

      <h3>3. Thêm định nghĩa hoạt động (Add Activity Definition)</h3>
      <p>Tab này cho phép bạn thêm các loại hoạt động mới vào hệ thống.</p>
      <ol>
        <li><strong>Tên hoạt động:</strong> Nhập tên của hoạt động mới.</li>
        <li><strong>Điểm cộng:</strong> Nhập số điểm mà hoạt động này mang lại.</li>
        <li><strong>Thêm hoạt động:</strong> Nhấp "Add Activity" để lưu định nghĩa.</li>
      </ol>
      <ul>
        <li><strong>Lưu ý tránh lỗi:</strong>
          <ul>
            <li>Đảm bảo tên hoạt động rõ ràng và điểm cộng chính xác.</li>
            <li>Tránh tạo các hoạt động trùng lặp.</li>
          </ul>
        </li>
      </ul>

      <h3>4. Đăng thông báo (Post Notification)</h3>
      <p>Tab này cho phép bạn tạo và xuất bản các thông báo mới cho tất cả người dùng.</p>
      <ol>
        <li><strong>Tiêu đề:</strong> Nhập tiêu đề của thông báo.</li>
        <li><strong>Nội dung:</strong> Nhập nội dung chi tiết. Có thể sử dụng định dạng Markdown cơ bản.</li>
        <li><strong>Hình ảnh (tùy chọn):</strong> Tải lên một hình ảnh đi kèm.</li>
        <li><strong>Đăng:</strong> Nhấp "Post Notification" để xuất bản.</li>
      </ol>
      <ul>
        <li><strong>Lưu ý tránh lỗi:</strong>
          <ul>
            <li>Kiểm tra kỹ nội dung và chính tả trước khi đăng.</li>
            <li>Sử dụng hình ảnh có kích thước phù hợp để tránh làm chậm tải trang.</li>
          </ul>
        </li>
      </ul>

      <h3>5. Quản lý thông báo (từ trang Thông báo)</h3>
      <p>Ngoài các chức năng quản trị trên, khi bạn truy cập trang "Thông báo" (mà người dùng thông thường cũng thấy), bạn sẽ có thêm các tùy chọn quản lý.</p>
      <ul>
        <li><strong>Chỉnh sửa thông báo:</strong> Trên mỗi thông báo, nhấp biểu tượng "..." để mở menu, chọn "Edit" để chỉnh sửa.</li>
        <li><strong>Xóa thông báo:</strong> Nhấp biểu tượng "..." để mở menu, chọn "Delete" để xóa vĩnh viễn.</li>
      </ul>
      <ul>
        <li><strong>Lưu ý tránh lỗi:</strong>
          <ul>
            <li>Luôn xác nhận trước khi xóa thông báo, vì hành động này không thể hoàn tác.</li>
          </ul>
        </li>
      </ul>
    </div>
  );

  const tabs = [
    { label: 'Hướng dẫn người dùng', content: userGuideContent },
    { label: 'Hướng dẫn quản trị viên', content: adminGuideContent },
  ];

  return (
    <div className="docs-container">
      <h1>Tài liệu ứng dụng</h1>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default DocsView;