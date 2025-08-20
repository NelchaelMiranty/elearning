import React, { useState } from 'react';
import { Card, Divider, Typography, Button, Modal, Upload, message } from 'antd';
import { FilePptOutlined, CloseOutlined, PlusOutlined, FileOutlined } from '@ant-design/icons';
import FileWindow from '../components/FileWindow'; // Importez votre composant FileWindow

const { Title, Paragraph } = Typography;

const CourseDetail = ({ onPresentationCreated }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);
  const [pptFile, setPptFile] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [showFileWindow, setShowFileWindow] = useState(false); // Nouvel état pour afficher FileWindow

  const courses = [
    {
      title: "Resaux",
      content: "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
    },
    {
      title: "TCP/IP",
      content: "Body text for whatever you'd like to say. takeaway points, quotes, anecdotes, or short story."
    }
  ];

  // ... (gardez le reste de vos fonctions existantes telles quelles)

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
        {/* Boutons en haut à droite */}
        <div style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 2, // Augmentez le z-index pour que les boutons soient au-dessus de FileWindow
          display: 'flex',
          gap: '8px'
        }}>
          <Button 
            type="text" 
            icon={<FileOutlined />}
            onClick={() => setShowFileWindow(!showFileWindow)} // Basculer l'affichage de FileWindow
          />
          <Button 
            type="text" 
            icon={<CloseOutlined />}
            onClick={() => console.log('Fermer la fenêtre')}
          />
        </div>

        {/* Afficher FileWindow conditionnellement */}
        {showFileWindow && (
          <div style={{
            position: 'absolute',
            top: 60, // Position sous les boutons
            right: 16,
            zIndex: 1
          }}>
            <FileWindow />
          </div>
        )}

        {/* ... (gardez le reste de votre JSX existant pour les cours) ... */}
      </Card>

      {/* ... (gardez votre Modal existante) ... */}
    </>
  );
};

export default CourseDetail;