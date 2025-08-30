import React from 'react';
import Tabs from '../../components/shared/Tabs'; // Assuming Tabs component exists

const DocsView = () => {
  const tabs = [
    { label: 'Hướng dẫn người dùng', content: (
      <div>
        <h2>Hướng dẫn người dùng</h2>
        <h3>1. Trang tổng quan (Dashboard)</h3>
        <p>Trang tổng quan là nơi bạn có thể xem thông tin tổng quát. Tại đây, bạn có thể:</p>
        <ul>
          <li>Xem tổng số hoạt động, điểm cộng đã được duyệt và điểm rèn luyện cuối cùng của bạn.</li>
          <li>Chọn các học kỳ khác nhau để xem tóm tắt hoạt động của bạn trong giai đoạn đó.</li>
          <li>Tìm kiếm các hoạt động cụ thể mà bạn đã nộp.</li>
          <li>Xem bảng điểm rèn luyện của bạn qua các học kỳ khác nhau.</li>
          <li>Nhấp vào thẻ hoạt động để xem thông tin chi tiết, bao gồm tệp đã tải lên và trạng thái của nó.</li>
        </ul>

        <h3>2. Tải lên hoạt động</h3>
        <p>Để nộp một hoạt động mới để nhận điểm:</p>
        <ol>
          <li>Điều hướng đến trang "Tải lên".</li>
          <li>Chọn học kỳ liên quan.</li>
          <li>Chọn tên hoạt động từ danh sách thả xuống có thể tìm kiếm. Hệ thống sẽ tự động hiển thị số điểm liên quan đến hoạt động đó.</li>
          <li>Tải lên tệp hỗ trợ (ví dụ: chứng chỉ, bằng chứng tham gia).</li>
          <li>Nhấp vào "Gửi". Một cửa sổ xác nhận sẽ xuất hiện.</li>
          <li>Xác nhận việc nộp của bạn. Sau khi tải lên thành công, bạn sẽ được chuyển hướng đến Trang tổng quan.</li>
        </ol>

        <h3>3. Cài đặt</h3>
        <p>Trên trang Cài đặt, bạn có thể:</p>
        <ul>
          <li>Bật hoặc tắt Chế độ tối để thay đổi giao diện của ứng dụng.</li>
          <li>Đăng xuất khỏi tài khoản của bạn.</li>
        </ul>

        <h3>4. Công cụ tính điểm</h3>
        <p>Sử dụng Công cụ tính điểm để ước tính điểm rèn luyện tối đa của bạn:</p>
        <ol>
          <li>Chọn các tiêu chí áp dụng cho bạn (ví dụ: tham gia câu lạc bộ học thuật, nghiên cứu khoa học, là thành viên ban cán sự lớp).</li>
          <li>Cho biết bạn có tham gia hoạt động "Sinh hoạt Chi đoàn" bắt buộc hay không.</li>
          <li>Nhấp vào "Tính điểm rèn luyện" để xem điểm rèn luyện tối đa ước tính của bạn.</li>
        </ol>

        <h3>5. Thông báo</h3>
        <p>Trang Thông báo hiển thị các thông báo và cập nhật quan trọng:</p>
        <ul>
          <li>Xem danh sách các thông báo, được sắp xếp theo thứ tự mới nhất.</li>
          <li>Nhấp vào "Xem thêm" đối với các thông báo dài để đọc toàn bộ nội dung.</li>
          <li>Nhấp vào "Thích" để thể hiện sự đánh giá cao của bạn đối với một thông báo.</li>
          <li>Nhấp vào "Chia sẻ" để chia sẻ thông báo (nếu trình duyệt của bạn hỗ trợ).</li>
        </ul>
      </div>
    )},
    { label: 'Hướng dẫn quản trị viên', content: (
      <div>
        <h2>Hướng dẫn quản trị viên</h2>
        <p>Phần này cung cấp hướng dẫn cho quản trị viên quản lý ứng dụng.</p>

        <h3>1. Quyền truy cập quản trị viên</h3>
        <p>Quyền truy cập quản trị viên chỉ dành cho <strong>email do Lớp sở hữu</strong> (ví dụ: <code>dh23vt.ceft@gmail.com</code>) và <strong>email của nhà phát triển</strong>. Mọi tài khoản khác sẽ không thể truy cập khu vực này.</p>


        <h3>2. Quản lý hoạt động</h3>
        <p>Tab này cho phép bạn quản lý các hoạt động đã nộp của sinh viên.</p>
        <ul>
          <li><strong>Chọn học kỳ:</strong> Chọn một học kỳ để xem và quản lý các hoạt động trong giai đoạn đó.</li>
          <li><strong>Lọc:</strong> Sử dụng thanh tìm kiếm để lọc hoạt động theo tên.</li>
          <li><strong>Bảng hoạt động:</strong>
            <ul>
              <li>Xem danh sách phân trang tất cả các hoạt động đã nộp.</li>
              <li><strong>Hành động cá nhân:</strong> Nhấp vào một hàng để chỉnh sửa chi tiết (ví dụ: thay đổi trạng thái, điểm) hoặc xóa một hoạt động. Đảm bảo xác thực các thay đổi trạng thái.</li>
              <li><strong>Hành động hàng loạt:</strong> Chọn nhiều hoạt động bằng cách sử dụng các hộp kiểm. Sau đó, bạn có thể thực hiện cập nhật hàng loạt (ví dụ: thay đổi trạng thái cho tất cả các hoạt động đã chọn) hoặc xóa hàng loạt.</li>
            </ul>
          </li>
          <li><strong>Quản lý dữ liệu:</strong>
            <ul>
              <li><strong>Nhập/Xuất:</strong> Nhập dữ liệu hoạt động từ tệp JSON hoặc xuất dữ liệu hoạt động hiện tại sang tệp JSON.</li>
              <li><strong>Tạo báo cáo:</strong> Tạo báo cáo các hoạt động đã được phê duyệt. Báo cáo này có thể được sao chép vào clipboard ở định dạng HTML để dễ dàng chia sẻ.</li>
            </ul>
          </li>
        </ul>

        <h3>3. Thêm định nghĩa hoạt động</h3>
        <p>Tab này cho phép bạn định nghĩa các hoạt động mới mà người dùng có thể chọn khi nộp. Bạn có thể chỉ định tên hoạt động và số điểm liên quan đến nó.</p>

        <h3>4. Đăng thông báo</h3>
        <p>Sử dụng tab này để tạo và xuất bản các thông báo mới cho tất cả người dùng. Bạn có thể bao gồm tiêu đề, nội dung và hình ảnh tùy chọn.</p>

        <h3>5. Quản lý thông báo (từ trang Thông báo)</h3>
        <p>Khi ở trên trang "Thông báo" chính (có thể truy cập bởi tất cả người dùng), với tư cách là quản trị viên, bạn có các đặc quyền bổ sung:</p>
        <ul>
          <li><strong>Chỉnh sửa thông báo:</strong> Nhấp vào menu "..." trên một thông báo để chỉnh sửa tiêu đề, nội dung hoặc hình ảnh của nó.</li>
          <li><strong>Xóa thông báo:</strong> Nhấp vào menu "..." trên một thông báo để xóa nó.</li>
        </ul>
      </div>
    )},
  ];

  return (
    <div className="docs-container">
      <h1>Tài liệu ứng dụng</h1>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default DocsView;
