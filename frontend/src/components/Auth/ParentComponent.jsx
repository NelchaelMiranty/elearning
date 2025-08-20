import React, { useState } from "react";
import CourseDetail from "./CourseDetail";
import Chat from "./Chat";

const ParentComponent = () => {
  const [currentPresentation, setCurrentPresentation] = useState(null);

  // currentPresentation sera un objet { name, url } par exemple

  return (
    <>
      <CourseDetail onPresentationCreated={setCurrentPresentation} />
      <Chat presentation={currentPresentation} />
    </>
  );
};

export default ParentComponent;
