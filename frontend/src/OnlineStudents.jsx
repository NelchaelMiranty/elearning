import React from "react";
import { FaUserCircle } from "react-icons/fa";

const OnlineStudents = ({ students = [], onSelect }) => {
  return (
    <div >
      <ul className="list-none p-0 m-0">
        {(students || []).map((student) => (
          <li
            key={student.id}
            className="flex items-center mb-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
            onClick={() => onSelect(student)}
          >
            <input
              type="checkbox"
              checked={student.present}
              onChange={(e) => {
                e.stopPropagation();
                onSelect({ ...student, present: e.target.checked });
              }}
              className="mr-3 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <FaUserCircle className="text-xl mr-2 text-gray-500" />
            <span className="flex-1 text-gray-700">{student.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineStudents;