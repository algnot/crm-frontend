"use client";
import Input from "@/components/input";
import { useApp } from "@/components/providers/app-provider";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronUp,
  IconPhoto,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";

type Product = {
  id: number;
  productName: string;
  serialNumber: string;
  receiptNumber: string;
  purchaseChannel: string;
  purchaseDate: string;
  receiptImage: string;
  expanded: boolean;
};

function createProduct(id: number): Product {
  return {
    id,
    productName: "",
    serialNumber: "",
    receiptNumber: "",
    purchaseChannel: "",
    purchaseDate: "",
    receiptImage: "",
    expanded: true,
  };
}

export default function Warranty() {
  const { clientConfig } = useApp();
  const router = useRouter();
  const [products, setProducts] = React.useState<Product[]>([createProduct(1)]);

  const updateProduct = (
    id: number,
    field: keyof Omit<Product, "id" | "expanded">,
    value: string,
  ) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const toggleExpand = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, expanded: !p.expanded } : p)),
    );
  };

  const addProduct = () => {
    const maxId = Math.max(...products.map((p) => p.id), 0);
    setProducts((prev) => [...prev, createProduct(maxId + 1)]);
  };

  const removeProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleImageChange = (id: number, file: File | null) => {
    if (!file) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, receiptImage: "" } : p)),
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, receiptImage: result } : p)),
      );
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex flex-col px-5 pb-10">
      <div className="flex items-center pt-8 pb-6 gap-4">
        <button
          type="button"
          aria-label="Back"
          onClick={() => router.push(`/${clientConfig.slug}`)}
          className="rounded-full border border-white/12 bg-black/45 p-2 text-white shadow-lg backdrop-blur-sm shrink-0"
        >
          <IconChevronLeft size={24} />
        </button>
        <p
          className="font-bodoni text-xl font-medium"
          style={{ color: clientConfig.ui.text_color }}
        >
          ลงทะเบียนรับประกันสินค้า
        </p>
      </div>

      <button
        type="button"
        aria-label="Add product"
        className="mb-4 rounded-xl py-3 text-sm font-semibold w-full flex items-center justify-center gap-2 text-red-600 bg-red-950"
      >
        *** Not supported yet ***
      </button>

      <div className="flex flex-col gap-3">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="p-4 border rounded-xl"
            style={{
              color: clientConfig.ui.text_color,
              borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
            }}
          >
            <button
              type="button"
              className="flex items-center justify-between w-full"
              onClick={() => toggleExpand(product.id)}
              style={{ color: clientConfig.ui.text_color }}
            >
              <span className="flex items-center gap-1">
                <span>
                  สินค้าชิ้นที่ {index + 1}
                  {product.productName ? ` — ${product.productName}` : ""}
                </span>
              </span>
              {product.expanded ? (
                <IconChevronUp size={18} />
              ) : (
                <IconChevronDown size={18} />
              )}
            </button>

            {product.expanded && (
              <div className="flex flex-col gap-2 mt-3">
                <div>
                  <div
                    className="pb-0.5 px-1 text-xs mb-1"
                    style={{ color: clientConfig.ui.text_white_color }}
                  >
                    สินค้า
                  </div>
                  <Input
                    type="text"
                    value={product.productName}
                    onChange={(v) =>
                      updateProduct(product.id, "productName", v)
                    }
                    placeholder="ระบุรายละเอียดสินค้า"
                  />
                </div>
                <div>
                  <div
                    className="pb-0.5 px-1 text-xs mb-1"
                    style={{ color: clientConfig.ui.text_white_color }}
                  >
                    Serial Number
                  </div>
                  <Input
                    type="text"
                    value={product.serialNumber}
                    onChange={(v) =>
                      updateProduct(product.id, "serialNumber", v)
                    }
                    placeholder="1U-2509K-0001"
                  />
                </div>
                <div>
                  <div
                    className="pb-0.5 px-1 text-xs mb-1"
                    style={{ color: clientConfig.ui.text_white_color }}
                  >
                    หมายเลขใบเสร็จรับเงิน
                  </div>
                  <Input
                    type="text"
                    value={product.receiptNumber}
                    onChange={(v) =>
                      updateProduct(product.id, "receiptNumber", v)
                    }
                    placeholder="หมายเลขใบเสร็จรับเงิน"
                  />
                </div>
                <div>
                  <div
                    className="pb-0.5 px-1 text-xs mb-1"
                    style={{ color: clientConfig.ui.text_white_color }}
                  >
                    ช่องทางการซื้อสินค้า
                  </div>
                  <Input
                    type="text"
                    value={product.purchaseChannel}
                    onChange={(v) =>
                      updateProduct(product.id, "purchaseChannel", v)
                    }
                    placeholder="ออนไลน์ / ร้านค้า / ตัวแทนจำหน่าย"
                  />
                </div>
                <div>
                  <div
                    className="pb-0.5 px-1 text-xs mb-1"
                    style={{ color: clientConfig.ui.text_white_color }}
                  >
                    วันที่ซื้อสินค้า
                  </div>
                  <Input
                    type="date"
                    value={product.purchaseDate}
                    onChange={(v) =>
                      updateProduct(product.id, "purchaseDate", v)
                    }
                    placeholder="ระบุวันที่ซื้อสินค้า"
                  />
                </div>

                <div>
                  <div
                    className="pb-0.5 px-1 text-xs mb-1"
                    style={{ color: clientConfig.ui.text_white_color }}
                  >
                    รูปภาพใบเสร็จ
                  </div>
                  {product.receiptImage ? (
                    <div className="relative">
                      <img
                        src={product.receiptImage}
                        alt="receipt"
                        className="w-full max-h-48 object-contain rounded-xl border"
                        style={{
                          borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 60%, transparent)`,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleImageChange(product.id, null)}
                        className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white"
                      >
                        <IconX size={14} />
                      </button>
                    </div>
                  ) : (
                    <label
                      className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer gap-1"
                      style={{
                        borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 60%, transparent)`,
                        color: clientConfig.ui.text_gray_color,
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageChange(
                            product.id,
                            e.target.files?.[0] ?? null,
                          )
                        }
                      />
                      <IconPhoto size={28} />
                      <span className="text-xs">แตะเพื่ออัพโหลดรูปใบเสร็จ</span>
                    </label>
                  )}
                </div>

                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(product.id)}
                    className="mt-1 text-xs flex items-center gap-1 self-start"
                    style={{ color: "rgb(248 113 113)" }}
                  >
                    <IconTrash size={14} />
                    ลบสินค้านี้
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Add product"
        className="mb-1 rounded-xl py-3 text-sm font-semibold border w-full flex items-center justify-center gap-2 mt-4"
        onClick={addProduct}
        style={{
          background: clientConfig.ui.surface_color,
          color: clientConfig.ui.text_color,
          borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
        }}
      >
        <IconPlus size={20} />
        <p>เพิ่มสินค้า</p>
      </button>
    </div>
  );
}
