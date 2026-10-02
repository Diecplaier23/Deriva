import { $ } from "./dom.js";

export function initializeDownload() {
  $("downloadSummaryButton").addEventListener("click", downloadSummaryImage);
}

async function downloadSummaryImage() {
  const width = 960;
  const scale = 2;
  const padding = 46;
  const capturedAt = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(new Date());
  const metrics = Array.from(document.querySelectorAll(".summary-card .summary-metric:not([hidden])"), (row) => ({
    label: row.querySelector("span").textContent.trim(),
    value: row.querySelector("strong").textContent.trim()
  }));
  const people = Array.from($("summaryPeople").children, (row) => ({
    name: row.querySelector("span").textContent.trim(),
    value: row.querySelector("strong").textContent.trim()
  }));
  const safetyNote = document.querySelector(".summary-card .safety-note:not([hidden])")?.textContent.replace(/\s+/g, " ").trim() || "";
  const metricStart = 262;
  const metricHeight = 40;
  const progressY = metricStart + (metrics.length - 1) * metricHeight + 14;
  const statusText = $("budgetStatus").hidden ? "" : $("budgetStatus").textContent.trim();
  const statusY = progressY + 36;
  const peopleHeadingY = progressY + 54 + (statusText ? 38 : 0);
  const peopleStartY = peopleHeadingY + 28;
  const safetyY = peopleStartY + people.length * 34 + 14;
  const height = safetyY + 72;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const context = canvas.getContext("2d");
  if (!context) return;
  context.scale(scale, scale);

  context.fillStyle = "#104e40";
  context.beginPath();
  context.roundRect(0, 0, width, height, 22);
  context.fill();

  context.fillStyle = "#176b56";
  context.beginPath();
  context.roundRect(padding, 34, 36, 36, 10);
  context.fill();
  context.strokeStyle = "#ffffff";
  context.lineWidth = 2.6;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();
  context.moveTo(padding + 10, 57);
  context.lineTo(padding + 24, 43);
  context.moveTo(padding + 14, 43);
  context.lineTo(padding + 24, 43);
  context.lineTo(padding + 24, 53);
  context.stroke();

  context.textAlign = "left";
  context.fillStyle = "#ffffff";
  context.font = "700 21px Arial, sans-serif";
  context.fillText("Deriva", padding + 49, 59);
  context.textAlign = "right";
  context.fillStyle = "#aac9bb";
  context.font = "700 12px Arial, sans-serif";
  context.fillText(capturedAt, width - padding, 56);

  context.textAlign = "left";
  context.fillStyle = "#bad0c6";
  context.font = "12px Arial, sans-serif";
  context.fillText(metrics[0].label, padding, 127);
  context.fillStyle = "#ffffff";
  context.font = "800 40px Arial, sans-serif";
  context.fillText(metrics[0].value, padding, 179);

  context.strokeStyle = "rgba(255,255,255,.18)";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(padding, 204);
  context.lineTo(width - padding, 204);
  context.stroke();

  metrics.slice(1).forEach((metric, index) => {
    const y = metricStart + index * metricHeight;
    context.textAlign = "left";
    context.fillStyle = "#d8e5de";
    context.font = "14px Arial, sans-serif";
    context.fillText(metric.label, padding, y, width * 0.64);
    context.textAlign = "right";
    context.fillStyle = index === 3 ? "#bce7c7" : "#ffffff";
    context.font = "700 14px Arial, sans-serif";
    context.fillText(metric.value, width - padding, y);
  });

  const progress = Number($("budgetProgress").parentElement.getAttribute("aria-valuenow")) / 100;
  context.fillStyle = "rgba(255,255,255,.16)";
  context.beginPath();
  context.roundRect(padding, progressY, width - padding * 2, 8, 4);
  context.fill();
  context.fillStyle = "#62a981";
  context.beginPath();
  context.roundRect(padding, progressY, (width - padding * 2) * progress, 8, 4);
  context.fill();

  if (statusText) {
    const statusIsCovered = $("budgetStatus").classList.contains("is-covered");
    const statusWidth = width - padding * 2;
    const statusBoxX = padding;
    const statusBoxY = statusY - 24;
    context.fillStyle = statusIsCovered ? "rgba(98,169,129,.15)" : "rgba(164,67,50,.16)";
    context.strokeStyle = statusIsCovered ? "#62a981" : "#ef8b7b";
    context.lineWidth = 1.5;
    context.beginPath();
    context.roundRect(statusBoxX, statusBoxY, statusWidth, 34, 9);
    context.fill();
    context.stroke();
    context.textAlign = "center";
    context.fillStyle = statusIsCovered ? "#a7e5b4" : "#ffc19e";
    context.font = "700 15px Arial, sans-serif";
    context.fillText(statusText, width / 2, statusY, width - padding * 2);
  }

  context.strokeStyle = "rgba(255,255,255,.18)";
  context.beginPath();
  context.moveTo(padding, peopleHeadingY - 10);
  context.lineTo(width - padding, peopleHeadingY - 10);
  context.stroke();
  context.textAlign = "left";
  context.fillStyle = "#bad0c6";
  context.font = "700 12px Arial, sans-serif";
  context.fillText($("summaryPeople").previousElementSibling.textContent.trim(), padding, peopleHeadingY + 8);

  people.forEach((person, index) => {
    const y = peopleStartY + index * 34;
    context.textAlign = "left";
    context.fillStyle = "#d8e5de";
    context.font = "13px Arial, sans-serif";
    context.fillText(person.name, padding, y, width * 0.68);
    context.textAlign = "right";
    context.fillStyle = "#ffffff";
    context.font = "700 13px Arial, sans-serif";
    context.fillText(person.value, width - padding, y);
  });

  context.textAlign = "left";
  context.fillStyle = "#b6cfc3";
  context.font = "12px Arial, sans-serif";
  const words = safetyNote.split(" ");
  let line = "";
  let lineY = safetyY;
  words.forEach((word) => {
    const nextLine = line ? `${line} ${word}` : word;
    if (context.measureText(nextLine).width > width - padding * 2 && line) {
      context.fillText(line, padding, lineY);
      line = word;
      lineY += 17;
    } else {
      line = nextLine;
    }
  });
  if (line) context.fillText(line, padding, lineY);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const download = document.createElement("a");
  download.href = url;
  download.download = "deriva-resumen.png";
  download.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}