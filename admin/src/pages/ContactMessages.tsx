import { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { tokenState } from "../store/atoms/auth";
import { IContactMessage } from "../types";
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import '../styles/Model.css'
import { ColorRing } from 'react-loader-spinner';
import { MdMessage } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import toast from "react-hot-toast";

const ContactMessages = () => {
  const [contactMessages, setContactMessages] = useState<IContactMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<IContactMessage | null>(null);
  const [loading,setLoading] = useState(true);
  const token = useRecoilValue(tokenState);

  document.title = "DevHub Admin | Manage Contact Messages 👥";

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("/api/v1/admin/geallcontactmessages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContactMessages(response.data.contactMessage);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading(true);
      }
    };

    fetchMessages();
  }, [token]);

  const downloadContactMessagesReport = async () => {
    try {
      const response = await axios.get('/api/v1/admin/downloadcontactmessagereport', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', 
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'StyleShare_Contact_Messages_Report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the Contact Messages report:', error);
    }
  };

  const handleDeleteMessage = async (id: string) => {
      try {
        await axios.delete(`/api/v1/admin/deletecontactmessage/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContactMessages(contactMessages.filter((msg) => msg.id !== id));
        toast.success("Contact Message deleted successfully !")
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error("Error in deleting message")
      }
  };
  
  const handleOpenModal = (message: IContactMessage) => {
    setSelectedMessage(message);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedMessage(null);
  };

  return (
    <div>
      <div className="flex-1 flex flex-col lg:ml-80">
        <div className="mx-5 mb-5">
        <span className="flex  items-center  text-xl font-bold decoration-sky-500 decoration-dotted underline">
          <div className='inline-block p-2 text-white bg-[#000435] rounded-lg mr-2'>
            <MdMessage size={23} />
          </div>
          All Contact Messages
        </span>
      </div>
        {loading ? 
        <div className="flex justify-center items-center h-80">
        <ColorRing
          visible={true}
          height="100"
          width="100"
          colors={['#000435', 'rgb(14 165 233)', 'rgb(243 244 246)','#000435','rgb(14 165 233)']}
        />
      </div>
      :
      <>
        <div className="mx-5 lg:mr-11 overflow-x-auto shadow-md rounded-xl mb-5">
          <table className="w-full rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs md:text-sm text-white uppercase bg-sky-500 text-center">
              <tr>
                <th scope="col" className="px-8 py-3 text-start">Name</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Subject</th>
                <th scope="col" className="px-6 py-3">Message</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {contactMessages.map(contactMessage => (
                <tr key={contactMessage.id} className="text-xs md:text-sm text-center border-b bg-[#000435] border-sky-500 hover:bg-blue-950 hover:text-white">
                  <td className="px-8 py-4 font-semibold">
                    <div className="flex flex-col items-start">
                      <span className="font-bold">{contactMessage.name}</span>
                      <span className="font-thin text-gray-300">{contactMessage.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 font-semibold">{new Date(contactMessage.createdAt).toLocaleDateString()}</td>
                  <td className="px-8 py-4 font-semibold">{contactMessage.subject.slice(0, 10)}</td>
                  <td className="px-12 py-4 font-semibold">{contactMessage.message.slice(0, 10)}</td>
                  <td className="px-2 py-4 grid grid-cols-1 gap-3 justify-center md:grid-cols-3">
                  <button
                    onClick={() => handleOpenModal(contactMessage)}
                    className="font-semibold rounded-md p-2 bg-sky-500 text-white border-2 hover:bg-sky-600"
                  >
                    Read
                  </button>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contactMessage.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold rounded-md p-2 bg-yellow-500 text-white border-2 hover:bg-yellow-600"
                  >
                    Reply
                  </a>
                  <button
                    onClick={() => handleDeleteMessage(contactMessage.id)}
                    className="font-semibold rounded-md p-2 bg-red-500 text-white border-2 hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mx-5 overflow-x-auto rounded-xl mb-5">
        <button onClick={downloadContactMessagesReport} className="flex items-center py-2.5 px-4 rounded-lg transition duration-200 bg-yellow-500 hover:bg-yellow-600 text-gray-100"><TbReportAnalytics size={23} className='mr-3'/>
            Download Messages
          </button>
        </div>
        </>
      }
      </div>
      <Modal open={open} onClose={handleCloseModal} center classNames={{ modal: 'customModal',overlay: 'customOverlay'}}>
        {selectedMessage && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Subject: {selectedMessage.subject}</h2>
            <p className="text-gray-700 mb-4 text-justify">{selectedMessage.message}</p>
            <p className="text-sm text-gray-600 mb-2"><strong>From:</strong> {selectedMessage.name}</p>
            <p className="text-sm text-gray-600 mb-2"><strong>Email:</strong> {selectedMessage.email}</p>
            <p className="text-sm text-gray-600"><strong>Delivered on:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContactMessages;
