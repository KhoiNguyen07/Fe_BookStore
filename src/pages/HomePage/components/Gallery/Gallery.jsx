import React from "react";
import { useLanguage } from "~/contexts/LanguageProvider";
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import g1 from "~/assets/images/homepage/gallery1.webp";
import g2 from "~/assets/images/homepage/gallery2.webp";
import g3 from "~/assets/images/homepage/gallery3.webp";
import g4 from "~/assets/images/homepage/gallery4.webp";
import g5 from "~/assets/images/homepage/gallery5.webp";
import g6 from "~/assets/images/homepage/gallery6.webp";
import g7 from "~/assets/images/homepage/gallery7.webp";
import g8 from "~/assets/images/homepage/gallery8.webp";
import g9 from "~/assets/images/homepage/gallery9.webp";
import g10 from "~/assets/images/homepage/gallery10.webp";

const imgArr = [g1, g2, g3, g4, g5, g6, g7, g8, g9, g10];

Fancybox.bind("[data-fancybox]", {
  // Your custom options
});

const Gallery = () => {
  const { t } = useLanguage();
  // Gallery shows images only (modal/lightbox removed)

  // Pattern cho grid
  const pattern = [
    { cols: 2, rows: 2 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 2, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 2, rows: 2 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 2, rows: 1 }
  ];

  return (
    <div className="py-12">
      <h2 className="text-3xl font-semibold text-center mb-8">
        {t("homepage.gallery.title")}
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-center">
        {t("homepage.gallery.subtitle")}
      </p>

      <div className="px-4">
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-4 auto-rows-fr">
          {/* show all images from imgArr */}
          {imgArr.map((img, i) => {
            const p = pattern[i % pattern.length];
            const mdSpan =
              p.cols === 2
                ? "md:col-span-3 lg:col-span-4"
                : "md:col-span-2 lg:col-span-2";
            const rowSpan = p.rows === 2 ? "row-span-2" : "";

            return (
              <a
                key={i}
                className={`${mdSpan} ${rowSpan} rounded-lg overflow-hidden relative bg-gray-100 border border-gray-800`}
                href={img}
                data-fancybox="gallery"
                data-caption={`Gallery #${i + 1}`}
              >
                <div
                  className="w-full h-full block focus:outline-none group"
                  role="img"
                  aria-label={`Gallery image ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`Gallery Image ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white w-full">
                      <div className="backdrop-blur-sm bg-black/30 rounded-md p-2 inline-block">
                        <span className="text-sm">
                          {t("homepage.gallery.view")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
