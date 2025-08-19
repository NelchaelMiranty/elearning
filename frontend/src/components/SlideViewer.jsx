import React from "react";
import { Empty } from "antd";

const SlideViewer = ({ slideUrl, onPrev, onNext }) => {
  if (!slideUrl) {
    return <Empty description="Aucune diapositive disponible" />;
  }

  const lowerUrl = slideUrl.toLowerCase();

  // Détection du type de fichier
  const isPpt = lowerUrl.endsWith(".ppt") || lowerUrl.endsWith(".pptx");
  const isPdf = lowerUrl.endsWith(".pdf");
  const isImage =
    lowerUrl.endsWith(".jpg") ||
    lowerUrl.endsWith(".jpeg") ||
    lowerUrl.endsWith(".png") ||
    lowerUrl.endsWith(".gif") ||
    lowerUrl.endsWith(".webp");

  // Mode Office Viewer pour PowerPoint
  if (isPpt) {
    const encodedUrl = encodeURIComponent(slideUrl);
    return (
      <iframe
        title="Présentation PowerPoint"
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`}
        style={{ width: "100%", height: "100%", border: "none", minHeight: 500 }}
        allowFullScreen
      />
    );
  }

  // Mode PDF
  if (isPdf) {
    return (
      <iframe
        title="PDF Viewer"
        src={slideUrl}
        style={{ width: "100%", height: "100%", border: "none", minHeight: 500 }}
      />
    );
  }

  // Mode image
  if (isImage) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <img
          src={slideUrl}
          alt="Slide"
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />

        {/* Boutons navigation si présents */}
        {onPrev && (
          <button
            onClick={onPrev}
            style={{
              position: "absolute",
              left: "10px",
              background: "#fff",
              border: "1px solid #ccc",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            ◀
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            style={{
              position: "absolute",
              right: "10px",
              background: "#fff",
              border: "1px solid #ccc",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            ▶
          </button>
        )}
      </div>
    );
  }

  // Fichier non supporté
  return <p style={{ textAlign: "center" }}>Ce type de fichier n’est pas encore supporté.</p>;
};

export default SlideViewer;
