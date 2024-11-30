'use client';

import React from 'react';
import { IoNotificationsCircle } from 'react-icons/io5';
import { FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';

const NewChatNotification = ({
  locale,
  userEmailAddress,
  userName
}: {
  locale: string;
  userEmailAddress: string;
  userName: string;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);

  const name = userName.split(' ')[0];

  const enMessage = `Hello ${name},\n\nYou have received a new message:\n\nPlease log in to your account to view the message.

  https://shelfcare.app/chat

  Best regards,
  Shelfcare Team  
  `;

  const fiMessage = `Hei ${name},\n\nOlet saanut uuden viestin:\n\nKirjaudu sisään tilillesi nähdäksesi viestin.

  https://shelfcare.app/chat

  Ystävällisin terveisin,
  Shelfcare-tiimi
  `;

  const handleSendEmail = async () => {
    try {
      setLoading(true);
      await fetch(`/${locale}/api/send-new-message-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userEmail: userEmailAddress,
          messageContent: locale === 'fi' ? fiMessage : enMessage,
          subject:
            locale === 'fi'
              ? 'ShelfCare: Uusi viesti'
              : 'ShelfCare: New Message'
        })
      });

      toast.success(
        locale === 'fi'
          ? 'Sähköposti asiakkaalle lähetetty onnistuneesti!'
          : 'Email sent to customer successfully!'
      );
    } catch (error) {
      toast.error(
        locale === 'fi'
          ? 'Sähköpostin lähettäminen asiakkaalle epäonnistui.'
          : 'Failed to send email to customer.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        className="cursor-pointer flex items-center"
        onClick={handleSendEmail}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {loading ? (
          <FiLoader className="animate-spin" />
        ) : (
          <span>
            <IoNotificationsCircle size={42} />
          </span>
        )}
      </button>
      {showTooltip && !loading && (
        <div className="absolute top-full mt-1 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-lg">
          {locale === 'fi' ? 'Ilmoita asiakkaalle' : 'Notify customer'}
        </div>
      )}
    </div>
  );
};

export default NewChatNotification;
