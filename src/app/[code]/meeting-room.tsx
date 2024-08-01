'use client';

import React from 'react';
import Link from 'next/link';
import { useMediaQuery } from 'react-pre-hooks';
import { useSession } from '~/components/session-provider';
import { useMeetingRoom } from './provider';
import { MediaStreamVideo } from '~/components/media-stream-video';

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
  SearchIcon,
} from '~/components/icons';
import { CheckCheck as DoubleCheckIcon } from 'lucide-react';
import { UserAvatar } from '~/components/user-avatar';
import { Textarea } from '~/components/ui/textarea';
import { Input } from '~/components/ui/input';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import { Sheet, SheetContent } from '~/components/ui/sheet';

import { WarningPage } from './warning-page';
import { UserMeetingInstant } from './user-meeting-instant';
import { cn, getTimeString } from '~/lib/utils';

import type { ChatMessage, MeetingUser } from '~/types';

import {
  SettingsMenu,
  MeiaStateToggle,
  ChatToggle,
  ParticipantsToggle,
  HangUpButton,
  ShareScreenButton,
} from './controls';

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
    <div className="grid w-full max-w-lg gap-4 px-4">
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
        className="aspect-[3/2]"
      />
      <div className="flex w-full items-center justify-between">
        <div className="flex w-fit gap-4">
          <MeiaStateToggle kind="audio" />
          <MeiaStateToggle kind="video" />
        </div>
        <SettingsMenu />
      </div>
    </div>
  );
}

function Room() {
  const userInfo = useSession().user!;
  const { userMedia, room, code } = useMeetingRoom();

  const [sidebarContentType, setSidebarContentType] = React.useState<'chat' | 'participants'>();
  const lastType = React.useRef<typeof sidebarContentType>();

  const displayedUsers = React.useMemo(() => {
    let allUsers = room.joinedUsers.filter(user => user.presenceKey !== room.speaker?.presenceKey);

    const currentUser: MeetingUser = {
      info: userInfo,
      stream: userMedia.stream,
      presenceKey: room.presenceKey.current,
    };

    let mainUser: MeetingUser | undefined;

    if (room.presenter) {
      mainUser = undefined;
      allUsers.unshift(currentUser);

      if (room.speaker) allUsers.unshift(room.speaker);
    } else if (room.speaker) {
      if (room.speaker.info.id === currentUser.info.id) {
        mainUser = currentUser;
        allUsers.unshift(room.speaker);
      } else {
        mainUser = room.speaker;
        allUsers.unshift(currentUser);
      }
    } else {
      mainUser = currentUser;
    }

    const length = allUsers.length;
    const count = length <= 3 ? length : length === 4 ? 4 : length === 5 ? 3 : length === 6 ? 6 : 5;

    return {
      count: length,
      main: mainUser,
      side: allUsers.slice(0, count),
      others: allUsers.slice(count, count + 3),
    };
  }, [room.joinedUsers, room.host, room.speaker, room.presenter, code]);

  const gridLayout = React.useMemo(() => {
    const count = displayedUsers.side.length + +!!displayedUsers.others.length;

    if (count <= 3) return { cols: 2, rows: count === 1 ? 6 : 5 - count };
    if (count < 6) return { cols: 1, rows: 3 };
    return { cols: 1, rows: 2 };
  }, [displayedUsers]);

  const mainViewClasses = React.useMemo(
    () =>
      cn(
        'col-span-2 row-span-full',
        displayedUsers.side.length ? 'portrait:col-span-full portrait:row-span-2' : 'col-span-full',
      ),
    [displayedUsers.side],
  );

  return (
    <div className="flex size-full flex-col">
      <div className="relative flex flex-1">
        <div className="flex flex-1 items-center">
          <div
            style={
              {
                '--span-x': `span ${gridLayout.cols}`,
                '--span-y': `span ${gridLayout.rows}`,
              } as any
            }
            className="mx-auto grid size-full w-full grid-flow-col grid-cols-4 grid-rows-6 flex-wrap gap-[--room-gap] px-[--room-gap] portrait:grid-cols-6 portrait:grid-rows-4 landscape:xl:max-w-[85dvw]"
          >
            {displayedUsers.main ? (
              <UserMeetingInstant
                presenceKey={displayedUsers.main.presenceKey}
                info={displayedUsers.main.info}
                stream={displayedUsers.main.stream}
                className={mainViewClasses}
              />
            ) : (
              <ScreenInstant className={mainViewClasses} />
            )}
            {displayedUsers.side.map(user => (
              <UserMeetingInstant
                key={user.presenceKey}
                presenceKey={user.presenceKey}
                info={user.info}
                stream={user.stream}
                className="[grid-column:var(--span-x)] [grid-row:var(--span-y)] portrait:[grid-column:var(--span-y)] portrait:[grid-row:var(--span-x)]"
              />
            ))}
            {displayedUsers.others.length > 0 && (
              <div className="content-center rounded-lg bg-muted [grid-column:var(--span-x)] [grid-row:var(--span-y)] portrait:[grid-column:var(--span-y)] portrait:[grid-row:var(--span-x)]">
                <div className="flex justify-center -space-x-4">
                  {displayedUsers.others.map(user => (
                    <UserAvatar
                      key={user.info.id}
                      user={user.info}
                      className="w-1/3 max-w-[63px]"
                      size={120}
                    />
                  ))}
                </div>
                <span className="mt-4 block text-center text-sm">
                  {displayedUsers.count - displayedUsers.side.length} more
                </span>
              </div>
            )}
          </div>
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
      <div className="flex w-full flex-grow-0 items-center justify-center gap-4 px-2 py-4 max-sm:gap-2 max-sm:py-2 max-sm:*:size-10 max-sm:[&_svg]:size-5">
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
        <SettingsMenu />
        <HangUpButton className="max-sm:p-0" />
      </div>
    </div>
  );
}

type ScreenInstantProps = React.ComponentProps<'div'>;

function ScreenInstant({ className, ...props }: ScreenInstantProps) {
  const { room } = useMeetingRoom();

  const isPresenting = room.presenter?.key === room.presenceKey.current;
  const presenterFirstName = room.presenter?.info.name.split(' ')[0];

  return (
    <div
      {...props}
      className={cn('relative flex items-center justify-center rounded-lg bg-muted', className)}
    >
      {room.screenStream ? (
        <MediaStreamVideo
          stream={room.screenStream}
          muted={isPresenting}
          className="absolute left-0 top-0 h-full w-full object-contain"
        />
      ) : (
        <LoadingAnimation className="w-20" />
      )}
      <span className="absolute bottom-0 left-0 z-30 block w-full overflow-hidden text-ellipsis whitespace-nowrap px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm">
        {presenterFirstName} is presenting.
      </span>
    </div>
  );
}

type SidebarProps = React.PropsWithChildren<{
  title: string;
  isOpen: boolean;
  onClose?: () => any;
}>;

function Sidebar({ children, title, isOpen, onClose }: SidebarProps) {
  const isMobileSize = useMediaQuery('(max-width: 940px)');

  if (isMobileSize) {
    return (
      <Sheet open={isOpen} onOpenChange={opened => !opened && onClose?.()}>
        <SheetContent side="right" className="w-full max-w-sm px-3 pt-3">
          <div className="flex size-full flex-col">
            <span className="block border-b pb-3 text-lg font-bold">{title}</span>
            {children}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn(
        '[--width:400px]',
        'relative grid min-h-full w-0 overflow-hidden transition-all duration-200',
        isOpen && 'w-[calc(var(--width)+var(--room-gap))]',
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
      <div id="chat-box" className="flex-1 overflow-auto py-4 pr-2">
        {room.chatMessages.length ? (
          <div className="flex min-h-full w-full flex-col justify-end">
            {room.chatMessages.array.map((message, index, arr) => {
              const prev = arr[index - 1];
              const isSameMessage =
                prev &&
                message.id === prev.id &&
                Math.abs(message.timestamp - prev.timestamp) < 60 * 1000;

              return <ChatItem key={index} messageOnly={isSameMessage} {...message} />;
            })}
          </div>
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
    inputRef.current.focus();

    setTimeout(() => {
      const chatBox = document.getElementById('chat-box') as HTMLDivElement;
      chatBox.scrollTo({ top: chatBox.scrollHeight });
    }, 0);
  }, []);

  return (
    <div className="flex items-center gap-4 py-4">
      <Textarea
        ref={inputRef}
        className="flex-1 resize-none"
        placeholder="Type a message"
        onKeyDown={e => e.key.toLowerCase() === 'enter' && sendMessage()}
      />
      <Button className="h-full min-h-10 w-10 p-2" onClick={sendMessage}>
        <SendIcon className="size-5" />
      </Button>
    </div>
  );
}

function ChatItem(props: ChatMessage & { messageOnly?: boolean }) {
  const time = React.useMemo(() => getTimeString(new Date(props.timestamp)), []);

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
  const userInfo = useSession().user!;
  const { room, code } = useMeetingRoom();
  const [name, setName] = React.useState('');

  const waitingUsers = React.useMemo(() => {
    if (!name) return room.waitingUsers;
    return room.waitingUsers.filter(user =>
      user.info.name.toLowerCase().includes(name.toLowerCase()),
    );
  }, [name, room.waitingUsers]);

  const joinedUsers = React.useMemo(() => {
    if (!name) return room.joinedUsers;
    return room.joinedUsers.filter(user =>
      user.info.name.toLowerCase().includes(name.toLowerCase()),
    );
  }, [name, room.joinedUsers]);

  return (
    <div className="flex-1 overflow-auto py-4 pr-2">
      <div className="relative mb-8 w-full">
        <Input
          placeholder="Search by name"
          className="w-full pl-9 focus-visible:ring-transparent"
          onChange={e => setName(e.target.value)}
        />
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      {waitingUsers.length > 0 && (
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
                        keys: waitingUsers.map(user => user.presenceKey),
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
                        keys: waitingUsers.map(user => user.presenceKey),
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
            {waitingUsers.map(user => (
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
          {joinedUsers.length + 1}
        </div>
      </div>
      <div className="grid gap-4">
        {room.host && <ParticipantItem user={room.host.info} presenceKey={room.host.presenceKey} />}
        <ParticipantItem user={userInfo} presenceKey={room.presenceKey.current} />
        {joinedUsers.map(user =>
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
            <Button
              className="rounded-full"
              size="icon"
              onClick={() => {
                room.sendJoinResponse({
                  keys: [props.presenceKey],
                  status: 'ACCEPTED',
                });
              }}
            >
              <CheckIcon className="size-5" />
            </Button>
            <Button
              variant="destructive"
              className="rounded-full"
              size="icon"
              onClick={() => {
                room.sendJoinResponse({
                  keys: [props.presenceKey],
                  status: 'REJECTED',
                });
              }}
            >
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
                      <MicOnIcon className="mr-2 size-4" /> Turn on the microphone
                    </>
                  ) : (
                    <>
                      <MicOffIcon className="mr-2 size-4" /> Turn off the micrphone
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
