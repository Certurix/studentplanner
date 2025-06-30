import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { Button, FileInput, Badge, TextInput } from "flowbite-react";

const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "Vous",
    message: "Hey, qui a les notes du dernier cours ?",
    timestamp: "10:30",
    isOwn: true,
  },
  {
    id: 2,
    sender: "Individu X",
    message: "Je les ai, tiens",
    timestamp: "10:32",
    isOwn: false,
    files: [
      {
        id: 1,
        name: "docker.pdf",
        size: "755 MB",
        type: "application/pdf",
        url: "#",
      },
      {
        id: 2,
        name: "carte-mentale-docker.pdf",
        size: "688 KB",
        type: "application/pdf",
        url: "#",
      },
    ],
  },
  {
    id: 3,
    sender: "Vous",
    message: "Merci !",
    timestamp: "10:35",
    isOwn: true,
  },
];

const FILE_ICONS = {
  pdf: "tabler:file-type-pdf",
  word: "tabler:file-type-doc",
  document: "tabler:file-type-doc",
  zip: "tabler:file-zip",
  rar: "tabler:file-zip",
  image: "tabler:photo",
  video: "tabler:video",
  audio: "tabler:music",
};

const Chat = () => {
  const [messages] = useState(MOCK_MESSAGES);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const getFileIcon = (type) => {
    const fileType = Object.keys(FILE_ICONS).find((key) => type.includes(key));
    return FILE_ICONS[fileType] || "tabler:file";
  };

  // Convert File objects to app format for consistency
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      type: file.type,
      file,
    }));
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeSelectedFile = (fileId) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
        <header className="border-b border-gray-200 p-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <Icon
              icon="tabler:messages"
              className="text-white"
              width={20}
              height={20}
            />
          </div>
        </header>

        <main className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              getFileIcon={getFileIcon}
            />
          ))}
        </main>

        <footer className="border-t border-gray-200 p-4 space-y-3">
          {selectedFiles.length > 0 && (
            <SelectedFilesPreview
              files={selectedFiles}
              onRemove={removeSelectedFile}
              getFileIcon={getFileIcon}
            />
          )}

          <MessageInput onFileSelect={handleFileSelect} />
        </footer>
      </div>
    </section>
  );
};

const MessageBubble = ({ message, getFileIcon }) => (
  <article
    className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`max-w-[70%] ${message.isOwn ? "text-right" : "text-left"}`}
    >
      <div className="flex items-center space-x-2 mb-1">
        <span className="font-medium text-sm text-gray-900">
          {message.sender}
        </span>
        <span className="text-xs text-gray-500">{message.timestamp}</span>
      </div>

      <div
        className={`p-2 pb-1 text-left rounded-lg ${
          message.isOwn
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        {message.message && <p className="text-sm mb-2">{message.message}</p>}

        {message.files?.length > 0 && (
          <div className="space-y-2">
            {message.files.map((file) => (
              <FileAttachment
                key={file.id}
                file={file}
                isOwn={message.isOwn}
                getFileIcon={getFileIcon}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  </article>
);

const FileAttachment = ({ file, isOwn, getFileIcon }) => (
  <div
    className={`flex items-center space-x-3 p-2 rounded border ${
      isOwn ? "bg-indigo-500 border-indigo-400" : "bg-white border-gray-200"
    }`}
  >
    <Icon
      icon={getFileIcon(file.type)}
      className={isOwn ? "text-white" : "text-gray-600"}
      width={20}
      height={20}
    />
    <div className="flex-1 min-w-0">
      <p
        className={`text-xs font-medium truncate ${
          isOwn ? "text-white" : "text-gray-900"
        }`}
      >
        {file.name}
      </p>
      <p className={`text-xs ${isOwn ? "text-indigo-100" : "text-gray-500"}`}>
        {file.size}
      </p>
    </div>
    <Button
      size="xs"
      color={isOwn ? "light" : "default"}
      className="shrink-0 bg-transparent text-gray-600 enabled:hover:bg-gray-100 enabled:hover:text-gray-900 rounded-full"
      onClick={() => window.open(file.url, "_blank")}
    >
      <Icon icon="tabler:download" width={14} height={14} />
    </Button>
  </div>
);

const SelectedFilesPreview = ({ files, onRemove, getFileIcon }) => (
  <div className="space-y-2">
    <p className="text-sm font-medium text-gray-700">
      Fichiers sélectionnés ({files.length})
    </p>
    <div className="flex flex-wrap gap-2">
      {files.map((file) => (
        <Badge
          key={file.id}
          color="blue"
          className="flex items-center gap-2 px-3 py-1"
        >
          <Icon icon={getFileIcon(file.type)} width={14} height={14} />
          <span className="text-xs max-w-24 truncate">{file.name}</span>
          <span className="text-xs opacity-75">({file.size})</span>
          <button
            onClick={() => onRemove(file.id)}
            className="ml-1 hover:bg-blue-700 rounded-full p-0.5"
          >
            <Icon icon="tabler:x" width={12} height={12} />
          </button>
        </Badge>
      ))}
    </div>
  </div>
);

const MessageInput = ({ onFileSelect }) => (
  <div className="flex space-x-2">
    <TextInput
      id="message-input"
      placeholder="Écrivez un message..."
      className="flex-1 px-3 py-2 rounded-lg focus:border-indigo-500"
      required
    />

    <div className="relative">
      <FileInput
        id="file-upload"
        multiple
        onChange={onFileSelect}
        className="hidden"
        accept=".pdf,.doc,.docx,.zip,.rar,.jpg,.jpeg,.png,.gif,.mp4,.mp3"
      />
      <Button
        color="indigo"
        className="px-3 py-2"
        onClick={() => document.getElementById("file-upload").click()}
      >
        <Icon icon="tabler:paperclip" width={20} height={20} />
      </Button>
    </div>

    <Button
      color="default"
      className="px-4 py-2 flex items-center gap-2"
      disabled
    >
      <Icon icon="tabler:send" width={20} height={20} />
      Envoyer
    </Button>
  </div>
);

export default Chat;
