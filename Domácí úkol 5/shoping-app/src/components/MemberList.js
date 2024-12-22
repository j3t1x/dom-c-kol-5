import React, { useState } from 'react';

function MemberList({ members, addMember, removeMember }) {
  const [newMember, setNewMember] = useState("");

  return (
    <div>
      <h2>Členové</h2>
      <ul>
        {members.map((member, index) => (
          <li key={index}>
            {member} <button onClick={() => removeMember(member)}>Odebrat</button>
          </li>
        ))}
      </ul>
      <input value={newMember} onChange={(e) => setNewMember(e.target.value)} placeholder="Přidat člena" />
      <button onClick={() => { addMember(newMember); setNewMember(""); }}>Přidat člena</button>
    </div>
  );
}

export default MemberList;
