"use client";

import { useState } from "react";

const faqData = [
  {
    question: "VidSnap có miễn phí không?",
    answer:
      "Hoàn toàn miễn phí! Bạn có thể tải video không giới hạn mà không cần trả bất kỳ khoản phí nào. Không cần đăng ký tài khoản.",
  },
  {
    question: "Video có được lưu trữ trên server của VidSnap không?",
    answer:
      "Không. VidSnap chỉ là trang trung gian, giúp bạn stream video trực tiếp từ nguồn gốc (YouTube, TikTok, Instagram). Chúng tôi không lưu trữ bất kỳ video nào trên server.",
  },
  {
    question: "Có giới hạn số lượng video tải về không?",
    answer:
      "Không có giới hạn! Bạn có thể tải bao nhiêu video tùy thích, bất kể thời gian nào trong ngày.",
  },
  {
    question: "Tôi có thể tải video TikTok không watermark không?",
    answer:
      "Có! VidSnap hỗ trợ tải video TikTok mà không có watermark (logo TikTok), giúp bạn có video sạch để sử dụng.",
  },
  {
    question: "Tại sao video tải về không play được?",
    answer:
      "VidSnap sử dụng stream trực tiếp từ nguồn, đảm bảo file tải về đúng định dạng và dung lượng. Nếu gặp vấn đề, hãy thử chọn chất lượng khác (ví dụ 720p thay vì 1080p) hoặc dùng VLC Media Player để mở video.",
  },
  {
    question: "Tải video có vi phạm bản quyền không?",
    answer:
      "VidSnap cung cấp công cụ tải video cho mục đích cá nhân. Vui lòng tôn trọng bản quyền của người tạo nội dung. Không sử dụng video đã tải cho mục đích thương mại mà chưa có sự cho phép.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="section-header">
          <span className="section-label">❓ FAQ</span>
          <h2 className="section-title">Câu Hỏi Thường Gặp</h2>
          <p className="section-subtitle">
            Mọi thắc mắc của bạn đều được giải đáp tại đây
          </p>
        </div>

        <div className="faq__list">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`faq__item glass-card ${openIndex === index ? "faq__item--open" : ""}`}
              onClick={() => toggleFaq(index)}
            >
              <div className="faq__question">
                <span>{item.question}</span>
                <span className="faq__arrow">▼</span>
              </div>
              <div className="faq__answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
