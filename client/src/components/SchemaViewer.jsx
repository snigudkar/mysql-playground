// // client/src/components/SchemaViewer.jsx
// import React from 'react';
// import { BookOpen } from 'lucide-react'; // Import icon

// /**
//  * Component to display the database schema.
//  * @param {{schema: object, loadingSchema: boolean}} props
//  */
// const SchemaViewer = ({ schema, loadingSchema }) => {
//   return (
//     <section className="flex-1 bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col border border-white/10">
//       <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
//         <BookOpen className="w-6 h-6 mr-2 text-purple-300" />
//         Practice Schema
//       </h2>
//       {loadingSchema ? (
//         <p className="text-gray-400">Loading schema...</p>
//       ) : (
//         <div className="bg-gray-700/50 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-600/50 mb-6 shadow-inner">
//           {Object.keys(schema).length > 0 ? (
//             Object.keys(schema).map(tableName => (
//               <div key={tableName} className="mb-4 last:mb-0">
//                 <h4 className="text-xl font-semibold text-green-400 mb-2">{tableName}</h4>
//                 <ul className="list-disc list-inside text-gray-300 ml-4">
//                   {schema[tableName].map(col => (
//                     <li key={`${tableName}-${col.name}`} className="mb-1 text-sm">
//                       <span className="font-medium text-yellow-300">{col.name}</span>: {col.type}
//                       {col.notnull && <span className="text-red-400"> (NOT NULL)</span>}
//                       {col.pk && <span className="text-purple-400"> (PK)</span>}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-400 text-center">No schema information available.</p>
//           )}
//         </div>
//       )}
//     </section>
//   );
// };

// export default SchemaViewer;
// client/src/components/SchemaViewer.jsx
import React from 'react';
import { BookOpen } from 'lucide-react'; // Import icon

/**
 * Component to display the database schema.
 * @param {{schema: object, loadingSchema: boolean}} props
 */
const SchemaViewer = ({ schema, loadingSchema }) => {
  return (
    <section className="flex-1 bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col border border-white/10">
      <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
        <BookOpen className="w-6 h-6 mr-2 text-purple-300" />
        Practice Schema
      </h2>
      {/* Dummy text added below Practice Schema */}
      <p className="text-white text-sm mb-4">
        Explore the structure of your practice database here. Feel free to add your own tables for custom exercises!
      </p>
      {loadingSchema ? (
        <p className="text-gray-400">Loading schema...</p>
      ) : (
        <div className="bg-gray-700/50 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-600/50 mb-6 shadow-inner">
          {Object.keys(schema).length > 0 ? (
            Object.keys(schema).map(tableName => (
              <div key={tableName} className="mb-4 last:mb-0">
                <h4 className="text-xl font-semibold text-green-400 mb-2">{tableName}</h4>
                <ul className="list-disc list-inside text-gray-300 ml-4">
                  {schema[tableName].map(col => (
                    <li key={`${tableName}-${col.name}`} className="mb-1 text-sm">
                      <span className="font-medium text-yellow-300">{col.name}</span>: {col.type}
                      {col.notnull && <span className="text-red-400"> (NOT NULL)</span>}
                      {col.pk && <span className="text-purple-400"> (PK)</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No schema information available.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default SchemaViewer;
