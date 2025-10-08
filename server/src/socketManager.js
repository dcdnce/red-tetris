let ioInstance = null;

export const SocketManager = {
  /**
   *  To be called ONLY ONE TIME from index.js to attach ioServer.
   * @param {import('socket.io').Server} io
   */
  init: (io) => {
    if (!ioInstance) {
      ioInstance = io;
    }
  },

  /**
   * Returns Socket.IO server instance.
   * @returns {import('socket.io').Server}
   */
  getIO: () => {
    if (!ioInstance) {
      throw new Error("Socket.IO has not been initialized. Call init() first.");
    }
    return ioInstance;
  }
};