import moment from "moment";
import domtoimage from "dom-to-image-more";

export const applyComputedStyles = (element: HTMLElement) => {
  const elements = element.querySelectorAll("*");

  elements.forEach((el) => {
    const computed = window.getComputedStyle(el);
    const props = [
      "color",
      "backgroundColor",
      "borderColor",
      "boxShadow",
      "font",
      "fontSize",
      "fontWeight",
      "lineHeight",
      "textAlign",
      "display",
      "justifyContent",
      "alignItems",
      "padding",
      "margin",
      "border",
      "borderRadius",
      "width",
      "height",
    ] as const;

    props.forEach((prop) => {
      const value = computed[prop];
      if (value && !value.includes("oklch")) {
        (el as HTMLElement).style.setProperty(prop, value);
      }
    });
  });
};

export const getLightColorFromImage = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!imageUrl || typeof imageUrl !== "string") {
      return reject(new Error("Invalid image url"));
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return resolve("#ffffff");

      // Set canvas size to match image
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw image without any border
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;

      let r = 0,
        g = 0,
        b = 0,
        count = 0;

      // Sample every 5th pixel for better performance
      for (let i = 0; i < imageData.length; i += 5 * 4) {
        const red = imageData[i];
        const green = imageData[i + 1];
        const blue = imageData[i + 2];
        const alpha = imageData[i + 3];

        // Skip transparent pixels
        if (alpha < 128) continue;

        // Calculate perceived brightness (human eye weights colors differently)
        const brightness = 0.299 * red + 0.587 * green + 0.114 * blue;

        // Adjust threshold based on your needs (0-255)
        if (brightness > 150) {
          r += red;
          g += green;
          b += blue;
          count++;
        }
      }

      // Fallback to average color if no bright pixels found
      if (count === 0) {
        resolve("#ffffff");
      } else {
        // Use rounding instead of flooring for better color accuracy
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        resolve(`rgb(${r}, ${g}, ${b})`);
      }
    };

    img.onerror = (err) => {
      console.error("Failed to load image:", err);
      reject(new Error("Image could not be loaded or is blocked by CORS."));
    };
  });
};

export function formatYearMonth(yearMonth: string) {
  return yearMonth
    ? yearMonth
        .split(" - ")
        .map((date) => moment(date, "YYYY-MM").format("MM/YYYY"))
        .join(" - ")
    : "";
}

export const fixTailwindColors = (element: HTMLElement) => {
  const elements = element.querySelectorAll("*");

  elements.forEach((el) => {
    const style = window.getComputedStyle(el);
    const props = ["color", "backgroundColor", "borderColor"] as const;

    props.forEach((prop) => {
      const value = style[prop];
      if (value.includes("oklch")) {
        (el as HTMLElement).style.setProperty(prop, "#000"); // fallback to black or any safe color
      }
    });
  });
};

// convert component to image sử dụng dom-to-image-more
export async function captureElementAsImage(
  element: HTMLElement
): Promise<string> {
  if (!element) throw new Error("Element not found");

  await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Ép toàn bộ style inline để tránh mất màu / layout
  applyComputedStyles(element);

  const scale = 2;
  const width = element.scrollWidth;
  const height = element.scrollHeight;

  // Áp style layout chính xác vào ảnh render
  const style = {
    transform: `scale(${scale})`,
    transformOrigin: "top left",
    position: "absolute",
    width: `${width}px`,
    height: `${height}px`,
    overflow: "hidden",
    border: "none",
  };

  const params = {
    width: width * scale,
    height: height * scale,
    style,
    quality: 1,
    bgcolor: "#ffffff", // nền trắng
    filter: (node: HTMLElement) => {
      return !(
        node instanceof HTMLStyleElement || node instanceof HTMLScriptElement
      );
    },
  };

  return await domtoimage.toPng(element, params);
}

export const dataURLtoFile = (dataUrl: string, fileName: string) => {
  const arr = dataUrl.split(",");
  const match = arr[0].match(/:(.*?);/);
  const mine = match?.[1] ?? "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mine });
};
