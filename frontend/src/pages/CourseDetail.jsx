import React, { useState, useEffect } from 'react';
import { Card, Divider, Typography, Button, Modal, Upload, message, List, Popconfirm, Space } from 'antd';
import { FilePptOutlined, CloseOutlined, PlusOutlined, FileOutlined, DeleteOutlined } from '@ant-design/icons';
import FileWindow from '../components/FileWindow';

const { Title, Paragraph } = Typography;

const CourseDetail = ({ onPresentationCreated }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);
  const [pptFile, setPptFile] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [showFileWindow, setShowFileWindow] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([
    { 
      name: "Chapitre 1.pdf", 
      url: "/documents/chapitre1.pdf",
      type: "application/pdf" 
    },
    { 
      name: "Chapitre 2.pptx", 
      url: "/documents/chapitre2.pptx",
      type: "application/vnd.ms-powerpoint" 
    }
  ]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const fileWindow = document.querySelector('.file-window-container');
      const fileButton = document.querySelector('.file-button');
      
      if (showFileWindow && fileWindow && !fileWindow.contains(e.target)) {
        if (fileButton && !fileButton.contains(e.target)) {
          setShowFileWindow(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFileWindow]);

  const handleCreateClick = (course) => {
    setActiveCourse(course);
    setModalVisible(true);
    setPptFile(null);
    setIsSubmitDisabled(true);
  };

  const beforeUpload = (file) => {
    const isPPT = file.type === 'application/vnd.ms-powerpoint' || 
                 file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    if (!isPPT) {
      message.error('Seuls les fichiers PowerPoint (PPT/PPTX) sont acceptés !');
      return Upload.LIST_IGNORE;
    }
    setPptFile(file);
    setIsSubmitDisabled(false);
    return false;
  };

  const handleSubmit = () => {
    if (!pptFile) return;

    const url = URL.createObjectURL(pptFile);
    const newFile = { name: pptFile.name, url, type: pptFile.type };

    setUploadedFiles(prev => [...prev, newFile]);
    onPresentationCreated?.(newFile);

    message.success("Présentation envoyée avec succès !");
    setModalVisible(false);
    setPptFile(null);
    setIsSubmitDisabled(true);
  };

  const handleDeleteFile = (fileName) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const courses = [
    {
      title: "Réseaux",
      content: "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
    },
    {
      title: "TCP/IP",
      content: "Body text for whatever you'd like to say. Takeaway points, quotes, anecdotes, or short story."
    }
  ];

  return (
    <>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 800,
          border: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'relative'
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Space style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
        }}>
          <Button 
            type="text" 
            icon={<FileOutlined />}
            onClick={() => setShowFileWindow(!showFileWindow)}
            className="file-button"
          />
          <Button 
            type="text" 
            icon={<CloseOutlined />}
            onClick={() => setShowFileWindow(false)}
            aria-label="Fermer la fenêtre des fichiers"
          />
        </Space>

        {showFileWindow && (
          <div style={{
            position: 'absolute',
            top: 60,
            right: 16,
            zIndex: 9,
            width: 320,
            maxHeight: '60vh'
          }}>
            <FileWindow 
              initialFiles={uploadedFiles}
              onClose={() => setShowFileWindow(false)}
            />
          </div>
        )}

        {courses.map((course, index) => (
          <React.Fragment key={index}>
            <Title 
              level={index === 0 ? 2 : 3} 
              style={{ 
                fontSize: index === 0 ? '24px' : '20px',
                marginBottom: 16
              }}
            >
              {course.title}
            </Title>
            <Paragraph style={{ marginBottom: 24 }}>
              {course.content}
            </Paragraph>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => handleCreateClick(course)}
              style={{ marginBottom: 24 }}
            >
              Créer une présentation
            </Button>
            
            {index < courses.length - 1 && <Divider style={{ margin: '24px 0' }} />}
          </React.Fragment>
        ))}
      </Card>

      <Modal
        title={`Nouvelle présentation - ${activeCourse?.title}`}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setPptFile(null);
          setIsSubmitDisabled(true);
        }}
        footer={null}
        centered
        width={500}
        destroyOnClose
      >
        <div style={{ padding: '16px 0', textAlign: 'center' }}>
          <Upload.Dragger
            name="file"
            multiple={false}
            accept=".ppt,.pptx"
            beforeUpload={beforeUpload}
            showUploadList={false}
            style={{ 
              padding: '40px 0',
              marginBottom: 24,
              border: '2px dashed #d9d9d9'
            }}
          >
            <p className="ant-upload-drag-icon">
              <FilePptOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text" style={{ fontSize: 16 }}>
              {pptFile ? pptFile.name : "Glissez-déposez votre fichier PPT ici"}
            </p>
            <p className="ant-upload-hint" style={{ fontSize: 14 }}>
              {pptFile ? "Fichier prêt à être envoyé" : "Ou cliquez pour sélectionner un fichier"}
            </p>
          </Upload.Dragger>

          <Button 
            type="primary" 
            size="large"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            block
          >
            Soumettre
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CourseDetail;