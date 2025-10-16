import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

const translations = {
  en: {
    // Header/Navigation
    nav: {
      home: "Home",
      shop: "Our Shop",
      about: "About us",
      contact: "Contacts",
      cart: "Cart",
      search: "Search",
      signin: "Sign in",
      favorite: "Favorite"
    },

    // Homepage sections
    homepage: {
      banner1: {
        title: "The Reading Corner",
        subtitle:
          "The Book Garden – A peaceful garden of knowledge where every book is a seed of inspiration, nurturing curiosity and the love for reading in every soul.",
        cta: "Go to shop",
        subBanner: {
          shipping: {
            title: "Fastest Shipping",
            subtitle: "Order at $39 order"
          },
          payment: {
            title: "100% Safe Payments",
            subtitle: "9 month installments"
          },
          return: {
            title: "14-Days Return",
            subtitle: "Shop with confidence"
          },
          support: {
            title: "24/7 Online Support",
            subtitle: "Delivered to home"
          }
        }
      },
      bestProducts: {
        title: "Our Best Products",
        subtitle: "Discover amazing books and premium collections",
        viewAll: "View All Products",
        shopNow: "Shop Now",
        categories: {
          all: "All Products",
          music: "Music",
          architecture: "Architecture",
          horror: "Horror",
          art: "Art",
          fiction: "Fiction",
          nonfiction: "Non-Fiction",
          mystery: "Mystery",
          romance: "Romance",
          poetry: "Poetry",
          novel: "Novel",
          detective: "Detective",
          historical: "Historical",
          contemporary: "Contemporary",
          scifi: "Sci-Fi",
          biography: "Biography",
          history: "History",
          selfhelp: "Self-Help"
        }
      },

      banner: {
        title: "Welcome to BookVerse",
        subtitle: "Your Journey to Knowledge Starts Here",
        cta: "Explore Books",
        discount: "Up to 50% Off",
        featured: "Featured Collection"
      },

      gallery: {
        title: "Gallery",
        subtitle: "Browse our beautiful collection",
        view: "View"
      },

      blog: {
        title: "Latest from Our Blog",
        subtitle:
          "Discover reading tips, author interviews, and book recommendations",
        readMore: "Read More",
        allPosts: "View All Posts",
        tags: {
          classics: "Classics",
          readingList: "Reading List",
          home: "Home",
          bookshelf: "Bookshelf",
          newReleases: "New Releases",
          recommendations: "Recommendations",
          authors: "Authors",
          interviews: "Interviews",
          design: "Design"
        },
        posts: {
          post1: {
            title: "5 Classics Every Booklover Should Read",
            excerpt:
              "A hand-picked list of timeless novels that shaped modern literature. Short summaries and why they matter."
          },
          post2: {
            title: "How to Care for Your Bookshelves",
            excerpt:
              "Practical tips to organize, clean, and style your bookshelves so your collection looks beautiful and lasts longer."
          },
          post3: {
            title: "New Releases: What to Watch For",
            excerpt:
              "A quick roundup of the most anticipated releases this season and the genres to keep an eye on."
          },
          post4: {
            title: "Author Spotlight: Emerging Voices",
            excerpt:
              "Meet the new authors making waves this year — brief interviews and recommended titles to start with."
          },
          post5: {
            title: "Designing a Cozy Reading Nook",
            excerpt:
              "Transform any corner of your home into the perfect reading sanctuary with these simple design tips."
          },
          post6: {
            title: "Book Club Discussion Guide",
            excerpt:
              "Essential questions and topics to make your book club meetings more engaging and thoughtful."
          }
        }
      },

      contact: {
        title: "Contact Us",
        subtitle: "Get in touch with our team",
        name: "Name",
        email: "Email",
        message: "Message",
        send: "Send Message",
        nameRequired: "Name is required",
        emailRequired: "Email is required",
        emailInvalid: "Invalid email",
        messageRequired: "Message is required",
        success: "Message sent successfully!",
        error: "Failed to send message. Please try again.",
        address: "Visit Our Store",
        phone: "Call Us",
        hours: "Store Hours"
      }
    },

    // Banner discount / promo section
    bannerDiscount: {
      badge: "✨ Special Limited Offers",
      headlineMain: "All books are 50% off now!",
      headlineSub: "Don't miss such a deal! 🔥",
      description:
        "Discover amazing stories and knowledge with our premium collection. Transform your reading experience with professionally curated books.",
      ctaExplore: "Explore Our Collection",
      countdownLabel: "Offer ends in",
      featuredCollection: "Featured Book Collection",
      tapToView: "Tap to view full size",
      bookLabels: {
        adventure: "Adventure",
        romance: "Romance"
      },
      floating: {
        featuredBook: "Featured Book",
        clickToPreview: "Click to preview"
      }
    },

    // Footer
    footer: {
      logo: "BOOKVERSE",
      callUs: "CALL US FREE",
      phone: "1800 68 68",
      address: "Address: 1234 Heaven Street, USA.",
      email: "Email: info@example.com",
      fax: "Fax: (+100) 123 456 7890",

      info: {
        title: "Info",
        items: [
          "Custom Service",
          "F.A.Q.'s",
          "Order Tracking",
          "Contact Us",
          "Events"
        ]
      },

      services: {
        title: "Services",
        items: [
          "Sitemap",
          "Privacy Policy",
          "Your Account",
          "Advanced Search",
          "Terms & Conditions"
        ]
      },

      account: {
        title: "Account",
        items: [
          "About Us",
          "Delivery Information",
          "Privacy Policy",
          "Discount",
          "Customer Service"
        ]
      },

      newsletter: {
        title: "Newsletter",
        subtitle:
          "Share contact information, store details, and brand content with your customers.",
        placeholder: "Your email address...",
        subscribe: "Subscribe"
      },

      copyright:
        "© Copyright 2024 | BookVerse By BookLaunch. Powered by Shopify.",
      backToTop: "Back to top"
    },

    // Common UI elements
    common: {
      loading: "Loading...",
      error: "Something went wrong",
      noResults: "No results found",
      viewMore: "View More",
      viewLess: "View Less",
      close: "Close",
      previous: "Previous",
      next: "Next",
      save: "Save",
      cancel: "Cancel",
      confirm: "Confirm",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      remove: "Remove",
      price: "Price",
      quantity: "Quantity",
      total: "Total",
      addToCart: "Add to Cart",
      buyNow: "Buy Now",
      countdown: {
        limitedOffer: "Limited Time Offer",
        dontMiss: "Don't miss out on this amazing deal!",
        days: "Days",
        hours: "Hours",
        minutes: "Mins",
        seconds: "Secs",
        dealExpired: "Deal Expired!",
        checkBack: "Check back for new offers",
        hurry: "Hurry up! Limited stock available"
      }
    }
  },

  vi: {
    // Header/Navigation
    nav: {
      home: "Trang chủ",
      shop: "Cửa hàng",
      about: "Về chúng tôi",
      contact: "Liên hệ",
      cart: "Giỏ hàng",
      search: "Tìm kiếm",
      signin: "Đăng nhập",
      favorite: "Yêu thích"
    },

    // Homepage sections
    homepage: {
      banner1: {
        title: "Góc Đọc Sách",
        subtitle:
          "Khu Vườn Sách – Một khu vườn tri thức yên bình nơi mỗi cuốn sách là một hạt giống cảm hứng, nuôi dưỡng sự tò mò và tình yêu đọc sách trong mỗi tâm hồn.",
        cta: "Đến cửa hàng",
        subBanner: {
          shipping: {
            title: "Giao Hàng Nhanh Nhất",
            subtitle: "Đơn hàng từ $39"
          },
          payment: {
            title: "Thanh Toán An Toàn",
            subtitle: "Trả góp 9 tháng"
          },
          return: {
            title: "Đổi Trả Trong 14 Ngày",
            subtitle: "Mua sắm tự tin"
          },
          support: {
            title: "Hỗ Trợ 24/7",
            subtitle: "Giao hàng tận nhà"
          }
        }
      },
      bestProducts: {
        title: "Sản Phẩm Nổi Bật",
        subtitle: "Khám phá những bộ sưu tập cao cấp",
        viewAll: "Xem Tất Cả Sản Phẩm",
        shopNow: "Mua Ngay",
        categories: {
          all: "Tất Cả",
          music: "Âm Nhạc",
          architecture: "Kiến Trúc",
          horror: "Kinh Dị",
          art: "Nghệ Thuật",
          fiction: "Tiểu Thuyết",
          nonfiction: "Phi Tiểu Thuyết",
          mystery: "Trinh Thám",
          romance: "Lãng Mạn",
          poetry: "Thơ",
          novel: "Tiểu Thuyết",
          detective: "Trinh Thám",
          historical: "Lịch Sử",
          contemporary: "Đương Đại",
          scifi: "Khoa Học Viễn Tưởng",
          biography: "Tiểu Sử",
          history: "Lịch Sử",
          selfhelp: "Phát Triển Bản Thân"
        }
      },

      banner: {
        title: "Chào Mừng Đến BookVerse",
        subtitle: "Hành Trình Tri Thức Của Bạn Bắt Đầu Từ Đây",
        cta: "Khám Phá Sách",
        discount: "Giảm Giá Lên Đến 50%",
        featured: "Bộ Sưu Tập Nổi Bật"
      },

      gallery: {
        title: "Thư Viện Ảnh",
        subtitle: "Khám phá bộ sưu tập tuyệt đẹp của chúng tôi",
        view: "Xem"
      },

      blog: {
        title: "Tin Tức Mới Nhất",
        subtitle:
          "Khám phá những mẹo đọc sách, phỏng vấn tác giả và gợi ý sách hay",
        readMore: "Đọc Thêm",
        allPosts: "Xem Tất Cả Bài Viết",
        tags: {
          classics: "Kinh Điển",
          readingList: "Danh Sách Đọc",
          home: "Nhà Cửa",
          bookshelf: "Kệ Sách",
          newReleases: "Sách Mới",
          recommendations: "Gợi Ý",
          authors: "Tác Giả",
          interviews: "Phỏng Vấn",
          design: "Thiết Kế"
        },
        posts: {
          post1: {
            title: "5 Tác Phẩm Kinh Điển Mọi Người Yêu Sách Nên Đọc",
            excerpt:
              "Danh sách tuyển chọn những tiểu thuyết vượt thời gian đã định hình văn học hiện đại. Tóm tắt ngắn gọn và lý do tại sao chúng quan trọng."
          },
          post2: {
            title: "Cách Chăm Sóc Kệ Sách Của Bạn",
            excerpt:
              "Những mẹo thực tế để sắp xếp, làm sạch và trang trí kệ sách sao cho bộ sưu tập của bạn trông đẹp và bền lâu."
          },
          post3: {
            title: "Sách Mới Phát Hành: Điều Cần Quan Tâm",
            excerpt:
              "Tổng hợp nhanh những cuốn sách được mong đợi nhất mùa này và những thể loại cần chú ý."
          },
          post4: {
            title: "Tiêu Điểm Tác Giả: Những Giọng Nói Mới Nổi",
            excerpt:
              "Gặp gỡ những tác giả mới đang tạo nên làn sóng năm nay — phỏng vấn ngắn và những tựa sách được khuyến nghị để bắt đầu."
          },
          post5: {
            title: "Thiết Kế Góc Đọc Sách Ấm Cúng",
            excerpt:
              "Biến bất kỳ góc nào trong nhà bạn thành nơi đọc sách hoàn hảo với những mẹo thiết kế đơn giản này."
          },
          post6: {
            title: "Hướng Dẫn Thảo Luận Câu Lạc Bộ Sách",
            excerpt:
              "Những câu hỏi và chủ đề thiết yếu để làm cho các buổi họp câu lạc bộ sách của bạn hấp dẫn và sâu sắc hơn."
          }
        }
      },

      contact: {
        title: "Liên Hệ Với Chúng Tôi",
        subtitle: "Hãy liên lạc với đội ngũ của chúng tôi",
        name: "Tên",
        email: "Email",
        message: "Tin nhắn",
        send: "Gửi Tin Nhắn",
        nameRequired: "Tên là bắt buộc",
        emailRequired: "Email là bắt buộc",
        emailInvalid: "Email không hợp lệ",
        messageRequired: "Tin nhắn là bắt buộc",
        success: "Tin nhắn đã được gửi thành công!",
        error: "Gửi tin nhắn thất bại. Vui lòng thử lại.",
        address: "Ghé Thăm Cửa Hàng",
        phone: "Gọi Cho Chúng Tôi",
        hours: "Giờ Mở Cửa"
      }
    },

    // Banner discount / promo section (Vietnamese)
    bannerDiscount: {
      badge: "✨ Ưu Đãi Có Hạn",
      headlineMain: "Tất cả sách giảm 50% ngay bây giờ!",
      headlineSub: "Đừng bỏ lỡ cơ hội này! 🔥",
      description:
        "Khám phá những câu chuyện và kiến thức tuyệt vời với bộ sưu tập cao cấp của chúng tôi. Nâng tầm trải nghiệm đọc với những cuốn sách được tuyển chọn chuyên nghiệp.",
      ctaExplore: "Khám Phá Bộ Sưu Tập",
      countdownLabel: "Ưu đãi kết thúc sau",
      featuredCollection: "Bộ Sưu Tập Sách Nổi Bật",
      tapToView: "Chạm để xem kích thước đầy đủ",
      bookLabels: {
        adventure: "Phiêu Lưu",
        romance: "Lãng Mạn"
      },
      floating: {
        featuredBook: "Sách Nổi Bật",
        clickToPreview: "Nhấn để xem trước"
      }
    },

    // Footer
    footer: {
      logo: "BOOKVERSE",
      callUs: "GỌI MIỄN PHÍ",
      phone: "1800 68 68",
      address: "Địa chỉ: 1234 Heaven Street, USA.",
      email: "Email: info@example.com",
      fax: "Fax: (+100) 123 456 7890",

      info: {
        title: "Thông Tin",
        items: [
          "Dịch Vụ Khách Hàng",
          "Câu Hỏi Thường Gặp",
          "Theo Dõi Đơn Hàng",
          "Liên Hệ",
          "Sự Kiện"
        ]
      },

      services: {
        title: "Dịch Vụ",
        items: [
          "Sơ Đồ Trang Web",
          "Chính Sách Bảo Mật",
          "Tài Khoản Của Bạn",
          "Tìm Kiếm Nâng Cao",
          "Điều Khoản & Điều Kiện"
        ]
      },

      account: {
        title: "Tài Khoản",
        items: [
          "Về Chúng Tôi",
          "Thông Tin Giao Hàng",
          "Chính Sách Bảo Mật",
          "Giảm Giá",
          "Dịch Vụ Khách Hàng"
        ]
      },

      newsletter: {
        title: "Đăng Ký Nhận Tin",
        subtitle:
          "Chia sẻ thông tin liên hệ, chi tiết cửa hàng và nội dung thương hiệu với khách hàng của bạn.",
        placeholder: "Địa chỉ email của bạn...",
        subscribe: "Đăng Ký"
      },

      copyright:
        "© Bản quyền 2024 | BookVerse Bởi BookLaunch. Được hỗ trợ bởi Shopify.",
      backToTop: "Về đầu trang"
    },

    // Common UI elements
    common: {
      loading: "Đang tải...",
      error: "Có lỗi xảy ra",
      noResults: "Không tìm thấy kết quả",
      viewMore: "Xem Thêm",
      viewLess: "Xem Ít Hơn",
      close: "Đóng",
      previous: "Trước",
      next: "Tiếp",
      save: "Lưu",
      cancel: "Hủy",
      confirm: "Xác Nhận",
      delete: "Xóa",
      edit: "Chỉnh Sửa",
      add: "Thêm",
      remove: "Xóa",
      price: "Giá",
      quantity: "Số Lượng",
      total: "Tổng Cộng",
      addToCart: "Thêm Vào Giỏ",
      buyNow: "Mua Ngay",
      countdown: {
        limitedOffer: "Ưu Đãi Có Thời Hạn",
        dontMiss: "Đừng bỏ lỡ cơ hội tuyệt vời này!",
        days: "Ngày",
        hours: "Giờ",
        minutes: "Phút",
        seconds: "Giây",
        dealExpired: "Ưu đãi đã kết thúc!",
        checkBack: "Quay lại để xem những ưu đãi mới",
        hurry: "Nhanh lên! Số lượng có hạn"
      }
    }
  }
};

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("language") || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("language", language);
    } catch (error) {
      console.warn("Could not save language to localStorage:", error);
    }
  }, [language]);

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key; // Return the key if translation not found
      }
    }

    return value || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
