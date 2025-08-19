import React, { useState } from "react";
import { Card, Button, Upload, message, Popconfirm, List, Space } from "antd";
import { PlusOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import SlideViewer from "./SlideViewer";

const FileWindow = ({ initialFiles = [], onClose }) => {
  const [files, setFiles] = useState(initialFiles);
  const [visibleCount, setVisibleCount] = useState(5);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = (file) => {
    const newFile = {
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    };
    setFiles((prev) => [...prev, newFile]);
    setSelectedFile(newFile);
    message.success(`${file.name} ajouté avec succès`);
    return false;
  };

  const handleDelete = (index) => {
    const fileToDelete = files[index];
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    
    if (fileToDelete.url) {
      URL.revokeObjectURL(fileToDelete.url);
    }
    
    if (selectedFile && selectedFile === fileToDelete) {
      setSelectedFile(null);
    }
    
    message.success(`${fileToDelete.name} supprimé avec succès`);
  };

  const renderFilePreview = (file) => {
    if (!file) return null;

    if (file.type.includes("image")) {
      return (
        <img
          src={file.url}
          alt={file.name}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      );
    }

    if (file.type.includes("pdf")) {
      return (
        <iframe
          src={file.url}
          style={{ width: "100%", height: "100%", border: "none" }}
          title="PDF Viewer"
          sandbox="allow-scripts allow-same-origin"
        />
      );
    }

    if (file.type.includes("presentation") || file.name.endsWith(".ppt") || file.name.endsWith(".pptx")) {
      return <SlideViewer slideUrl={file.url} />;
    }

    return <p>Ce type de fichier n'est pas encore supporté.</p>;
  };

  return (
    <Card
      title="Fichiers disponibles"
      bordered
      style={{ width: "100%", display: "flex", flexDirection: "column", height: "100%" }}
      bodyStyle={{ display: "flex", flexDirection: "column", flex: 1 }}
      extra={
        <Space>
          <Upload beforeUpload={handleUpload} showUploadList={false}>
            <Button type="primary" icon={<PlusOutlined />}>
              Ajouter un fichier
            </Button>
          </Upload>
          {onClose && (
            <Button icon={<CloseOutlined />} onClick={onClose} />
          )}
        </Space>
      }
    >
      <div style={{ flex: 1, overflowY: "auto" }}>
        {files.length === 0 ? (
          <p style={{ textAlign: "center" }}>Aucun fichier disponible</p>
        ) : (
          <List
            dataSource={files.slice(0, visibleCount)}
            renderItem={(file, index) => (
              <List.Item
                style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}
                actions={[
                  <Popconfirm
                    title="Êtes-vous sûr de vouloir supprimer ce fichier ?"
                    onConfirm={() => handleDelete(index)}
                    okText="Oui"
                    cancelText="Non"
                    key="delete"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                ]}
              >
                <List.Item.Meta
                  title={
                    <Button 
                      type="link" 
                      onClick={() => setSelectedFile(file)}
                      style={{ padding: 0 }}
                    >
                      {file.name}
                    </Button>
                  }
                />
              </List.Item>
            )}
          />
        )}

        {selectedFile && (
          <div
            style={{
              marginTop: "20px",
              height: "500px",
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "5px",
              background: "#fafafa",
            }}
          >
            {renderFilePreview(selectedFile)}
          </div>
        )}
      </div>

      {files.length > visibleCount && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "10px",
            borderTop: "1px solid #ddd",
            background: "#fff",
          }}
        >
          <Button
            type="link"
            onClick={() => setVisibleCount(visibleCount + 5)}
          >
            Voir plus
          </Button>
        </div>
      )}
    </Card>
  );
};

export default FileWindow;