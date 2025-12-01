// interface TaskProps {
//   task: Task;
//   usersById: Record<string, User>;
// }

// const TaskCard = () => {
//   return (
//     <div className="task-card" role="article" aria-label={task.title}>
//       <div>
//         <h4 className="task-title">{task.title}</h4>
//         {task.description && <p className="task-desc">{task.description}</p>}
//       </div>

//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           marginTop: 6,
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 10,
//               color: "#6b7280",
//             }}
//           >
//             <CalendarOutlined />
//             <span style={{ fontSize: 13 }}>
//               {task.dueDate ? dayjs(task.dueDate).format("DD MMM") : "-"}
//             </span>
//           </div>
//           <div>
//             <span className="progress-badge">{task.progress ?? 0}%</span>
//           </div>
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <div className="avatars" aria-hidden>
//             {task.assignees.slice(0, 5).map((uid, idx) => {
//               const u = usersById[uid];
//               const bg = ["#6C5CE7", "#00B894", "#0984E3", "#FF9F1C"][idx % 4];
//               return (
//                 <Tooltip key={uid} title={u?.name || uid}>
//                   <div className="avatar-small" style={{ background: bg }}>
//                     {u?.initials ??
//                       (u?.name
//                         ? u.name
//                             .split(" ")
//                             .map((x) => x[0])
//                             .slice(0, 2)
//                             .join("")
//                         : "?")}
//                   </div>
//                 </Tooltip>
//               );
//             })}
//           </div>

//           <div
//             style={{
//               display: "flex",
//               gap: 10,
//               color: "#94a3b8",
//               alignItems: "center",
//             }}
//           >
//             <span
//               style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
//             >
//               <EyeOutlined /> {task.views ?? 0}
//             </span>
//             <span
//               style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
//             >
//               <MessageOutlined /> {task.comments ?? 0}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskCard;
