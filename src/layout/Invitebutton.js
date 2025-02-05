import { useState } from "react";

const Invite = () => {
  const [inviteLink, setInviteLink] = useState("");

  const generateInviteLink = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/invite/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to generate invite link");
      }

      const data = await response.json();
      const inviteId = data.inviteId;

      const appBaseUrl = window.location.origin;
      const inviteLink = `${appBaseUrl}/register?invite=${inviteId}`;

      console.log("✅ Invite link generated:", inviteLink);
      setInviteLink(inviteLink);
    } catch (error) {
      console.error(" Error generating invite link:", error);
    }
  };

  return (
    <div>
      <button
        onClick={generateInviteLink}
        style={{
          padding: "10px",
        //   backgroundColor: "green", // Changed to a single color
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Invite {/* Changed the text here */}
      </button>
      {inviteLink && (
        <div>
          <p>
            Invite Link: <a href={inviteLink} target="_blank" rel="noopener noreferrer">{inviteLink}</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Invite;
