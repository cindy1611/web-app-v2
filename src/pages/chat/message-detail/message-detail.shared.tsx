import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { ContactItem } from 'src/components/molecules/contact-item/contact-item.types';
import { chatMessages, CurrentIdentity, getChatParticipantsById } from 'src/core/api';
import { socket } from 'src/core/socket';
import { RootState } from 'src/store';

import { chatListAdaptor, getParticipantDetail, onPostMessage } from './message-detail.services';
import { MessageLoader } from './message-detail.types';

export const useMessageDetailShared = () => {
  const navigate = useNavigate();
  const [sendingValue, setSendingValue] = useState('');
  const identity = useSelector<RootState, CurrentIdentity | undefined>((state) => {
    return state.identity.entities.find((identity) => identity.current);
  });
  const resolver = useLoaderData() as MessageLoader;
  const { id } = useParams();
  const { messages, participants } = resolver;

  const chatList = chatListAdaptor(identity!.id, messages!.items, participants!.items);
  const participantDetail = getParticipantDetail(identity!.id, participants!.items);
  const [list, setList] = useState(chatList);
  const [loadingChat, setLoadingChat] = useState(false);

  function onSend() {
    if (id !== undefined && identity !== undefined) {
      const params = { id, identity, text: sendingValue };
      onPostMessage(params)
        .then((resp) => setList([...list, resp]))
        .then(() => setSendingValue(''));
    }
  }

  async function updateMessages(id: string) {
    setList([]);
    setLoadingChat(true);
    const messages = await chatMessages(id, { page: 1 });
    const participants = await getChatParticipantsById(id);

    const chatList = chatListAdaptor(identity!.id, messages!.items, participants!.items);
    setList(chatList);
    setLoadingChat(false);
  }

  async function onContactClick(contact: ContactItem) {
    navigate(`/chats/contacts/${contact.id}`);
    updateMessages(contact.id);
  }

  socket?.on('chat', (data) => {
    const receiver = list.filter((l) => l.type === 'receiver')[0];
    if (!receiver || data.identity_id === identity!.id) return;
    setList([
      ...list,
      {
        id: data.id,
        identityType: receiver.identityType,
        img: receiver?.img,
        text: data.text,
        type: 'receiver',
        time: data.updated_at,
      },
    ]);
  });

  return {
    participantDetail,
    list,
    sendingValue,
    setSendingValue,
    onSend,
    onContactClick,
    updateMessages,
    loadingChat,
  };
};
