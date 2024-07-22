'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from '~/components/session-provider';
import { useMeetingRoom } from './meeting-room-provider';

import { Button } from '~/components/ui/button';
import { LoadingAnimation } from '~/components/loading-animation';
import {
  HomeIcon as BackIcon,
  VideoIcon as JoinIcon,
  DropDownMenuIcon,
  SendIcon,
  X,
  CheckIcon,
  RemoveIcon,
  MicOffIcon,
  MicOnIcon,
} from '~/components/icons';
import { CheckCheck as DoubleCheckIcon } from 'lucide-react';
import { UserAvatar } from '~/components/user-avatar';
import { Textarea } from '~/components/ui/textarea';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import { UserMeetingInstant } from './user-meeting-instant';
import { WarningPage } from './waning-page';
import { cn } from '~/lib/utils';

import type { ChatMessage, MeetingUser } from '~/types';

import {
  MediaStreamSettingsMenu,
  MeiaStateToggle,
  ChatToggle,
  ParticipantsToggle,
  HangUpButton,
  ShareScreenButton,
} from './media-stream-controls';

export function MeetingRoom() {
  const { state } = useMeetingRoom();

  if (state === 'joined') return <Room />;

  if (state === 'ready' || state === 'joining') return <GettingReady />;

  if (state === 'rejected') {
    return <WarningPage title="You have been rejected from this call!" description="" />;
  }

  if (state === 'error') {
    return (
      <WarningPage
        title="Something went wrong!"
        description="Check your internet connection and reload the page."
      />
    );
  }

  return <LoadingAnimation key="loading" className="w-20" />;
}

function GettingReady() {
  const { user } = useSession();
  const { code, userMedia, state, setState, room } = useMeetingRoom();

  const isJoining = state === 'joining';

  const joinToMeeting = React.useCallback(async () => {
    if (!user) return;
    setState('joining');

    const response = await room.track();

    if (response !== 'ok') return setState('error');
    if (user.roomCode !== code) return;

    await room.sendJoinResponse({ keys: [room.presenceKey.current], status: 'ACCEPTED' });
  }, [user]);

  return (
    <div className="grid w-full max-w-lg gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Button variant="secondary" asChild>
          <Link
            href="/app"
            className={isJoining ? 'pointer-events-none opacity-50' : ''}
            onClick={() => {
              const page = document.querySelector('body > div') as HTMLDivElement;
              if (page) page.style.pointerEvents = 'none';
            }}
          >
            <BackIcon className="mr-2 size-5" /> Go back
          </Link>
        </Button>
        <Button loading={isJoining} onClick={joinToMeeting}>
          <JoinIcon className="mr-2 size-5" /> Join meeting
        </Button>
      </div>
      <UserMeetingInstant
        presenceKey={room.presenceKey.current}
        info={user!}
        stream={userMedia.stream}
      />
      <div className="flex w-full items-center justify-between">
        <div className="flex w-fit gap-4">
          <MeiaStateToggle kind="audio" />
          <MeiaStateToggle kind="video" />
        </div>
        <MediaStreamSettingsMenu />
      </div>
    </div>
  );
}

function Room() {
  const currentUser = useSession().user!;
  const { userMedia, room } = useMeetingRoom();
  const [sidebarContentType, setSidebarContentType] = React.useState<'chat' | 'participants'>();
  const lastType = React.useRef<typeof sidebarContentType>();

  return (
    <div className="flex size-full flex-col">
      <div className="flex flex-1 items-center">
        <div className="flex flex-1 flex-wrap justify-center gap-2 px-10 transition-all duration-200 *:w-[calc(100vw-2*theme(padding.12))] *:max-w-md">
          <UserMeetingInstant
            key={currentUser.id}
            presenceKey={room.presenceKey.current}
            info={currentUser}
            stream={userMedia.stream}
          />
          {room.joinedUsers.map(user => (
            <UserMeetingInstant
              key={user.info.id}
              presenceKey={user.presenceKey}
              info={user.info}
              stream={user.stream}
            />
          ))}
        </div>
        <Sidebar
          title={lastType.current === 'chat' ? 'Chat messages' : 'People'}
          isOpen={!!sidebarContentType}
          onClose={() => setSidebarContentType(undefined)}
        >
          {(sidebarContentType ?? lastType.current) === 'chat' ? (
            <ChatMessages />
          ) : (
            <Participants />
          )}
        </Sidebar>
      </div>
      <div className="flex w-full flex-grow-0 items-center justify-center gap-4 py-4">
        <MeiaStateToggle kind="audio" />
        <MeiaStateToggle kind="video" />
        <ChatToggle
          variant={sidebarContentType === 'chat' ? 'default' : 'secondary'}
          onClick={() => {
            setSidebarContentType(prev => (prev === 'chat' ? undefined : 'chat'));
            lastType.current = 'chat';
          }}
        />
        <ParticipantsToggle
          variant={sidebarContentType === 'participants' ? 'default' : 'secondary'}
          onClick={() => {
            setSidebarContentType(prev => (prev === 'participants' ? undefined : 'participants'));
            lastType.current = 'participants';
          }}
        />
        <ShareScreenButton />
        <MediaStreamSettingsMenu />
        <HangUpButton />
      </div>
    </div>
  );
}

type SidebarProps = React.PropsWithChildren<{
  title: string;
  isOpen: boolean;
  onClose?: () => any;
}>;

function Sidebar({ children, title, isOpen, onClose }: SidebarProps) {
  return (
    <div
      className={cn(
        '[--width:400px]',
        'relative grid min-h-full w-0 overflow-hidden transition-all duration-200',
        isOpen && 'w-[calc(var(--width)+theme(padding.2))]',
      )}
    >
      <div className="light absolute inset-0 min-h-full w-[--width] rounded-lg bg-background px-4 text-foreground">
        <div className="flex size-full flex-col">
          <div className="flex items-center justify-between border-b py-3">
            <span className="block text-lg font-bold">{title}</span>
            <Button variant="outline" className="size-10 rounded-full p-2" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function ChatMessages() {
  const { room } = useMeetingRoom();

  return (
    <>
      <div className="flex-1 overflow-auto py-4 pr-2">
        {room.chatMessages.length ? (
          room.chatMessages.array.map((message, index, arr) => {
            const prev = arr[index - 1];
            const isSameMessage =
              prev &&
              message.id === prev.id &&
              Math.abs(message.timestamp - prev.timestamp) < 60 * 1000;

            return <ChatItem key={index} messageOnly={isSameMessage} {...message} />;
          })
        ) : (
          <div className="text-center text-sm text-muted-foreground">No messages yet.</div>
        )}
      </div>
      <ChatInput />
    </>
  );
}

function ChatInput() {
  const { room } = useMeetingRoom();
  const user = useSession().user!;
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const sendMessage = React.useCallback(() => {
    if (!inputRef.current) return;

    const message = inputRef.current.value.trim();
    if (!message) return;

    room.sendChatMessage(user, message);
    room.chatMessages.push({
      id: room.presenceKey.current,
      user,
      message,
      timestamp: Date.now(),
    });

    inputRef.current.value = '';
    inputRef.current.dispatchEvent(new Event('input'));
  }, []);

  return (
    <div className="flex items-center gap-4 py-4">
      <Textarea ref={inputRef} className="flex-1 resize-none" placeholder="Type a message" />
      <Button className="h-full min-h-10 w-10 p-2" onClick={sendMessage}>
        <SendIcon className="size-5" />
      </Button>
    </div>
  );
}

function ChatItem(props: ChatMessage & { messageOnly?: boolean }) {
  const time = React.useMemo(() => {
    const date = new Date(props.timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }, []);

  if (props.messageOnly) {
    return (
      <div className="w-full pl-[43px] text-sm">
        <div className="mt-1 w-fit max-w-full break-words rounded-lg bg-muted px-3 py-2">
          {props.message}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex w-full items-start gap-2 text-sm">
      <UserAvatar user={props.user} size={120} />
      <div className="grid w-full gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold">{props.user.name}</span>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <div className="w-fit max-w-full break-words rounded-lg bg-muted px-3 py-2">
          {props.message}
        </div>
      </div>
    </div>
  );
}

function Participants() {
  const { room, code } = useMeetingRoom();

  return (
    <div className="flex-1 overflow-auto py-4 pr-2">
      {room.waitingUsers.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-bold text-muted-foreground">Waiting</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <DropDownMenuIcon className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <button
                    className="block w-full"
                    onClick={() => {
                      room.sendJoinResponse({
                        keys: room.waitingUsers.map(user => user.presenceKey),
                        status: 'ACCEPTED',
                      });
                    }}
                  >
                    <DoubleCheckIcon className="mr-2 size-4" /> Accept all
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button
                    className="block w-full"
                    onClick={() => {
                      room.sendJoinResponse({
                        keys: room.waitingUsers.map(user => user.presenceKey),
                        status: 'REJECTED',
                      });
                    }}
                  >
                    <X className="mr-2 size-4" /> Reject all
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid gap-4">
            {room.waitingUsers.map(user => (
              <ParticipantItem
                key={user.presenceKey}
                presenceKey={user.presenceKey}
                user={user.info}
                isWaiting
              />
            ))}
          </div>
        </div>
      )}
      <div className="mb-4 flex items-center justify-between">
        <span className="block text-sm font-bold text-muted-foreground">In-call</span>
        <div className="rounded-full border px-3.5 py-2 text-sm font-semibold">
          {room.joinedUsers.length + 1}
        </div>
      </div>
      <div className="grid gap-4">
        {room.host && (
          <ParticipantItem user={room.host.info} presenceKey={room.presenceKey.current} />
        )}
        {room.joinedUsers.map(user =>
          user.info.roomCode === code ? null : (
            <ParticipantItem
              key={user.presenceKey}
              presenceKey={user.presenceKey}
              user={user.info}
            />
          ),
        )}
      </div>
    </div>
  );
}

type ParticipantItemProps = {
  presenceKey: string;
  user: MeetingUser['info'];
  isWaiting?: boolean;
};

function ParticipantItem(props: ParticipantItemProps) {
  const { room, code } = useMeetingRoom();

  const isHost = props.user.roomCode === code;
  const isYou = props.presenceKey === room.presenceKey.current;

  const isMuted = room.mutedUsers.includes(props.presenceKey);

  return (
    <div className="flex w-full items-center text-sm">
      <div className="flex flex-grow items-center gap-2 ">
        <UserAvatar user={props.user} size={120} />
        <div className="w-px flex-grow overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="font-bold">{isYou ? 'You' : props.user.name}</span>{' '}
          {isHost && <span className="text-xs text-muted-foreground">(Host)</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {props.isWaiting ? (
          <>
            <Button className="rounded-full" size="icon">
              <CheckIcon className="size-5" />
            </Button>
            <Button variant="destructive" className="rounded-full" size="icon">
              <X className="size-5" />
            </Button>
          </>
        ) : isHost ? null : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <DropDownMenuIcon className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <button
                  className="block w-full"
                  onClick={() => room.sendMuteCommand(props.presenceKey, !isMuted)}
                >
                  {isMuted ? (
                    <>
                      <MicOffIcon className="mr-2 size-4" /> Turn of the micrphone
                    </>
                  ) : (
                    <>
                      <MicOnIcon className="mr-2 size-4" /> Turn on the microphone
                    </>
                  )}
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button
                  className="block w-full"
                  onClick={() => room.sendLeaveCommand(props.presenceKey)}
                >
                  <RemoveIcon className="mr-2 size-4" /> Remove from the call
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
