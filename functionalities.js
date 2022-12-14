const { DiscordRequest } = require("./utils.js");
const moment = require("moment");
require("dotenv").config();

async function getGuildDetails(serverId) {
  let endpoint = `guilds/${serverId}?with_counts=true`;
  const result = await DiscordRequest(endpoint, { method: "GET" });
  const data = await result.json();
  // const writeData = JSON.stringify(data, null, 4);
  // fs.writeFile("./GuildDetails.json", writeData, "utf8", (err) => {
  //   if (err) {
  //     console.log(`Error writing file: ${err}`);
  //   } else {
  //     console.log(`File is written successfully!`);
  //   }
  // });
  return data;
}

async function getGuildChannels(serverId) {
  let endpoint = `/guilds/${serverId}/channels`;
  const result = await DiscordRequest(endpoint, { method: "GET" });
  const data = await result.json();

  // const writeData = JSON.stringify(data, null, 4);
  // fs.writeFile("./GuildChannels.json", writeData, "utf8", (err) => {
  //   if (err) {
  //     console.log(`Error writing file: ${err}`);
  //   } else {
  //     console.log(`File is written successfully!`);
  //   }
  // });
  return data;
}

async function getGuildMembers(serverId) {
  let endpoint = `/guilds/${serverId}/members?limit=1000`;
  let result = await DiscordRequest(endpoint, { method: "GET" });
  let thisRoundData = await result.json();
  const data = [];
  while (thisRoundData.length) {
    data.push(...thisRoundData);
    const lastId = thisRoundData[thisRoundData.length - 1].user.id;
    endpoint = `/guilds/${serverId}/members?limit=1000&after=${lastId}`;
    result = await DiscordRequest(endpoint, { method: "GET" });
    thisRoundData = await result.json();
  }
  // const writeData = JSON.stringify(data, null, 4);
  // fs.writeFile("./GuildMembers.json", writeData, "utf8", (err) => {
  //   if (err) {
  //     console.log(`Error writing file: ${err}`);
  //   } else {
  //     console.log(`File is written successfully!`);
  //   }
  // });
  // console.log(data);
  return data;
}

//getGuildMembers("1044887003868713010");

async function searchGuildMember(serverId, username) {
  let endpoint = `/guilds/${serverId}/members/search?query=${username}`;
  const result = await DiscordRequest(endpoint, { method: "GET" });
  const data = await result.json();
  // const writeData = JSON.stringify(data, null, 4);
  // fs.writeFile("./GuildMember.json", writeData, "utf8", (err) => {
  //   if (err) {
  //     console.log(`Error writing file: ${err}`);
  //   } else {
  //     console.log(`File is written successfully!`);
  //   }
  // });
  return data;
}

//searchGuildMember("1044887003868713010", "ronmaa");
//no use since no additional info is given
async function getGuildMember(serverId, memberId) {
  let endpoint = `/guilds/${serverId}/members/${memberId}`;
  const result = await DiscordRequest(endpoint, { method: "GET" });
  const data = await result.json();
  // const writeData = JSON.stringify(data, null, 4);
  // fs.writeFile("./GuildMember.json", writeData, "utf8", (err) => {
  //   if (err) {
  //     console.log(`Error writing file: ${err}`);
  //   } else {
  //     console.log(`File is written successfully!`);
  //   }
  // });
  console.log(data);
  return data;
}

//getGuildMember("1044887003868713010", "1005929077770821704");

//no use since no additoinal info is given
async function getChannel(channelId) {
  let endpoint = `/channels/${channelId}`;
  const result = await DiscordRequest(endpoint, { method: "GET" });
  const data = await result.json();
  // const writeData = JSON.stringify(data, null, 4);
  // fs.writeFile("./channel.json", writeData, "utf8", (err) => {
  //   if (err) {
  //     console.log(`Error writing file: ${err}`);
  //   } else {
  //     console.log(`File is written successfully!`);
  //   }
  // });
  return data;
}

async function viewMessagesInAChannel(channelId) {
  let endpoint = `/channels/${channelId}/messages?limit=100`;
  const result = await DiscordRequest(endpoint, { method: "GET" });
  let thisRoundData = await result.json();
  const data = [];
  while (thisRoundData.length > 0) {
    data.push(...thisRoundData);
    const lastId = thisRoundData[thisRoundData.length - 1].id;
    endpoint = `/channels/${channelId}/messages?limit=100&after=${lastId}`;
    thisRoundData = await DiscordRequest(endpoint, { method: "GET" });
  }
  // const writeData = JSON.stringify(data, null, 4);
  // fs.writeFile("./channelMessages.json", writeData, "utf8", (err) => {
  //   if (err) {
  //     console.log(`Error writing file: ${err}`);
  //   } else {
  //     console.log(`File is written successfully!`);
  //   }
  // });
  return data;
}
//no use since no additional information is given
async function viewMessageInAChannel(channelId, messageId) {
  let endpoint = `/channels/${channelId}/messages/${messageId}`;
  const result = await DiscordRequest(endpoint, { method: "GET" });
  const data = await result.json();
  // const writeData = JSON.stringify(data, null, 4);
  // fs.writeFile("./channelMessage.json", writeData, "utf8", (err) => {
  //   if (err) {
  //     console.log(`Error writing file: ${err}`);
  //   } else {
  //     console.log(`File is written successfully!`);
  //   }
  // });
  return data;
}

//no use since no additional info from guildmember... if we are able to extract email or about or conenctions then there will be use
async function viewUser(userId) {
  let endpoint = `/users/${userId}`;
  const result = await DiscordRequest(endpoint, { method: "GET" });
  const data = await result.json();
  // const writeData = JSON.stringify(data, null, 4);
  // fs.writeFile("./user.json", writeData, "utf8", (err) => {
  //   if (err) {
  //     console.log(`Error writing file: ${err}`);
  //   } else {
  //     console.log(`File is written successfully!`);
  //   }
  // });
  return data;
}

async function findTotalUsersAndOnlineUsers(guildId) {
  const data = await getGuildDetails(guildId);
  const newData = {
    totalUsers: data.approximate_member_count,
    onlineUsers: data.approximate_presence_count,
  };
  return newData;
}

async function getTextandVoiceChannels(guildId) {
  const data = await getGuildChannels(guildId);
  //text == type0 and voice == type2
  const channels = [];
  data.forEach((channel) => {
    if (channel.type === 0 || channel.type === 2) {
      const { id, name } = channel;
      const minChannel = { id, name };
      channels.push(minChannel);
    }
  });

  return channels;
}

async function sortChannelsByMessageCountAllTime(guildId) {
  const data = await getTextandVoiceChannels(guildId);
  const channelsWithCount = await Promise.all(
    data.map(async (channel) => {
      const msgData = await viewMessagesInAChannel(channel.id);
      const nbMsgs = msgData.length;
      channel.nbMsgs = nbMsgs;
      return channel;
    })
  );

  channelsWithCount.sort((a, b) => {
    return a.nbMsgs - b.nbMsgs;
  });

  return channelsWithCount;
}

async function getWeekWiseMessageCount(channelId) {
  const msgData = await viewMessagesInAChannel(channelId);
  const countObj = {};
  msgData.forEach((msg) => {
    const weekOf = moment(msg["timestamp"])
      .startOf("isoWeek")
      .format("D MMM YYYY");
    if (countObj.hasOwnProperty(weekOf)) {
      countObj[weekOf]++;
    } else {
      countObj[weekOf] = 1;
    }
  });

  console.log(countObj);
  return countObj;
}

async function getMonthWiseMessageCount(channelId) {
  const msgData = await viewMessagesInAChannel(channelId);
  const countObj = {};
  msgData.forEach((msg) => {
    const monthOf = moment(msg["timestamp"])
      .startOf("month")
      .format("MMM YYYY");
    if (countObj.hasOwnProperty(monthOf)) {
      countObj[monthOf]++;
    } else {
      countObj[monthOf] = 1;
    }
  });

  console.log(countObj);
  return countObj;
}

async function getDayWiseMessageCount(channelId) {
  const msgData = await viewMessagesInAChannel(channelId);

  const countObj = {};
  msgData.forEach((msg) => {
    const dayOf = moment(msg["timestamp"]).startOf("day").format("D MMM YYYY");
    if (countObj.hasOwnProperty(dayOf)) {
      countObj[dayOf]++;
    } else {
      countObj[dayOf] = 1;
    }
  });

  console.log(countObj);
  return countObj;
}

async function getYearWiseMessageCount(channelId) {
  const msgData = await viewMessagesInAChannel(channelId);

  const countObj = {};
  msgData.forEach((msg) => {
    const yearOf = moment(msg["timestamp"]).startOf("year").format("YYYY");
    if (countObj.hasOwnProperty(yearOf)) {
      countObj[yearOf]++;
    } else {
      countObj[yearOf] = 1;
    }
  });

  console.log(countObj);
  return countObj;
}

async function getHourWiseMessageCount(channelId) {
  const msgData = await viewMessagesInAChannel(channelId);
  const countObj = {};
  msgData.forEach((msg) => {
    const hourOf = moment(msg["timestamp"]).startOf("hour").format("H");
    if (countObj.hasOwnProperty(hourOf)) {
      countObj[hourOf]++;
    } else {
      countObj[hourOf] = 1;
    }
  });

  console.log(countObj);
  return countObj;
}

async function getDayWiseUserJoinCount(guildId) {
  const userData = await getGuildMembers(guildId);
  const countObj = {};
  userData.forEach((user) => {
    const dayOf = moment(user["joined_at"]).startOf("day").format("D MMM YYYY");
    if (countObj.hasOwnProperty(dayOf)) {
      countObj[dayOf]++;
    } else {
      countObj[dayOf] = 1;
    }
  });

  console.log(countObj);
  return countObj;
}

async function getHourWiseUserJoinCount(guildId) {
  const userData = await getGuildMembers(guildId);
  const countObj = {};
  userData.forEach((user) => {
    const hourOf = moment(user["joined_at"]).startOf("hour").format("H");
    if (countObj.hasOwnProperty(hourOf)) {
      countObj[hourOf]++;
    } else {
      countObj[hourOf] = 1;
    }
  });

  console.log(countObj);
  return countObj;
}

async function getYearWiseUserJoinCount(guildId) {
  const userData = await getGuildMembers(guildId);
  const countObj = {};
  userData.forEach((user) => {
    const yearOf = moment(user["joined_at"]).startOf("year").format("YYYY");
    if (countObj.hasOwnProperty(yearOf)) {
      countObj[yearOf]++;
    } else {
      countObj[yearOf] = 1;
    }
  });

  console.log(countObj);
  return countObj;
}

async function getWeekWiseUserJoinCount(guildId) {
  const userData = await getGuildMembers(guildId);
  const countObj = {};
  userData.forEach((user) => {
    const weekOf = moment(user["joined_at"])
      .startOf("isoWeek")
      .format("D MMM YYYY");
    if (countObj.hasOwnProperty(weekOf)) {
      countObj[weekOf]++;
    } else {
      countObj[weekOf] = 1;
    }
  });

  console.log(countObj);
  return countObj;
}

async function getMonthWiseUserJoinCount(guildId) {
  const userData = await getGuildMembers(guildId);
  const countObj = {};
  userData.forEach((user) => {
    const monthOf = moment(user["joined_at"])
      .startOf("month")
      .format("MMM YYYY");
    if (countObj.hasOwnProperty(monthOf)) {
      countObj[monthOf]++;
    } else {
      countObj[monthOf] = 1;
    }
  });

  console.log(countObj);
  return countObj;
}

async function getWeekWiseSortedMessageCountChannel(guildId) {
  const allChannels = await getGuildChannels(guildId);
  const textAndVoiceChannels = [];
  allChannels.forEach((channel) => {
    if (channel.type === 0 || channel.type === 2) {
      const { id, name } = channel;
      const minChannel = { id, name };
      textAndVoiceChannels.push(minChannel);
    }
  });
  const weekWiseMessageCountofChannels = [];
  for (const channel of textAndVoiceChannels) {
    const weekData = await getWeekWiseMessageCount(channel.id);
    weekData.id = channel.id;
    weekData.name = channel.name;
    weekWiseMessageCountofChannels.push(weekData);
  }

  const len = weekWiseMessageCountofChannels.length;

  const sortedWeekWiseChannels = {};

  for (let i = 0; i < len; i++) {
    const currChannel = weekWiseMessageCountofChannels[i];
    Object.keys(currChannel).forEach((week) => {
      if (week === "id" || week === "name") {
        return;
      }
      const sorted = [];
      sorted.push({
        id: currChannel.id,
        name: currChannel.name,
        count: currChannel[week],
      });
      for (let k = 0; k < i; k++) {
        const channelWithout = weekWiseMessageCountofChannels[k];
        sorted.push({
          id: channelWithout.id,
          name: channelWithout.name,
          count: 0,
        });
      }
      for (let j = i + 1; j < len; j++) {
        const compareChannel = weekWiseMessageCountofChannels[j];
        if (compareChannel.hasOwnProperty(week)) {
          sorted.push({
            id: compareChannel.id,
            name: compareChannel.name,
            count: compareChannel[week],
          });
          delete compareChannel[week];
        } else {
          sorted.push({
            id: compareChannel.id,
            name: compareChannel.name,
            count: 0,
          });
        }
      }
      sorted.sort((a, b) => {
        return a.count - b.count;
      });
      sortedWeekWiseChannels[week] = sorted;
    });
  }

  console.log(sortedWeekWiseChannels);
  return sortedWeekWiseChannels;
}

async function getMonthWiseSortedMessageCountChannel(guildId) {
  const allChannels = await getGuildChannels(guildId);
  const textAndVoiceChannels = [];
  allChannels.forEach((channel) => {
    if (channel.type === 0 || channel.type === 2) {
      const { id, name } = channel;
      const minChannel = { id, name };
      textAndVoiceChannels.push(minChannel);
    }
  });
  const monthWiseMessageCountofChannels = [];
  for (const channel of textAndVoiceChannels) {
    const monthData = await getMonthWiseMessageCount(channel.id);
    monthData.id = channel.id;
    monthData.name = channel.name;
    monthWiseMessageCountofChannels.push(monthData);
  }

  const len = monthWiseMessageCountofChannels.length;

  const sortedMonthWiseChannels = {};

  for (let i = 0; i < len; i++) {
    const currChannel = monthWiseMessageCountofChannels[i];
    Object.keys(currChannel).forEach((month) => {
      if (month === "id" || month === "name") {
        return;
      }
      const sorted = [];
      sorted.push({
        id: currChannel.id,
        name: currChannel.name,
        count: currChannel[month],
      });
      for (let k = 0; k < i; k++) {
        const channelWithout = monthWiseMessageCountofChannels[k];
        sorted.push({
          id: channelWithout.id,
          name: channelWithout.name,
          count: 0,
        });
      }
      for (let j = i + 1; j < len; j++) {
        const compareChannel = monthWiseMessageCountofChannels[j];
        if (compareChannel.hasOwnProperty(month)) {
          sorted.push({
            id: compareChannel.id,
            name: compareChannel.name,
            count: compareChannel[month],
          });
          delete compareChannel[month];
        } else {
          sorted.push({
            id: compareChannel.id,
            name: compareChannel.name,
            count: 0,
          });
        }
      }
      sorted.sort((a, b) => {
        return a.count - b.count;
      });
      sortedMonthWiseChannels[month] = sorted;
    });
  }

  console.log(sortedMonthWiseChannels);
  return sortedMonthWiseChannels;
}

async function getDayWiseSortedMessageCountChannel(guildId) {
  const allChannels = await getGuildChannels(guildId);
  const textAndVoiceChannels = [];
  allChannels.forEach((channel) => {
    if (channel.type === 0 || channel.type === 2) {
      const { id, name } = channel;
      const minChannel = { id, name };
      textAndVoiceChannels.push(minChannel);
    }
  });
  const dayWiseMessageCountofChannels = [];
  for (const channel of textAndVoiceChannels) {
    const dayData = await getDayWiseMessageCount(channel.id);
    dayData.id = channel.id;
    dayData.name = channel.name;
    dayWiseMessageCountofChannels.push(dayData);
  }

  const len = dayWiseMessageCountofChannels.length;

  const sortedDayWiseChannels = {};

  for (let i = 0; i < len; i++) {
    const currChannel = dayWiseMessageCountofChannels[i];
    Object.keys(currChannel).forEach((day) => {
      if (day === "id" || day === "name") {
        return;
      }
      const sorted = [];
      sorted.push({
        id: currChannel.id,
        name: currChannel.name,
        count: currChannel[day],
      });
      for (let k = 0; k < i; k++) {
        const channelWithout = dayWiseMessageCountofChannels[k];
        sorted.push({
          id: channelWithout.id,
          name: channelWithout.name,
          count: 0,
        });
      }
      for (let j = i + 1; j < len; j++) {
        const compareChannel = dayWiseMessageCountofChannels[j];
        if (compareChannel.hasOwnProperty(day)) {
          sorted.push({
            id: compareChannel.id,
            name: compareChannel.name,
            count: compareChannel[day],
          });
          delete compareChannel[day];
        } else {
          sorted.push({
            id: compareChannel.id,
            name: compareChannel.name,
            count: 0,
          });
        }
      }
      sorted.sort((a, b) => {
        return a.count - b.count;
      });
      sortedDayWiseChannels[day] = sorted;
    });
  }

  console.log(sortedDayWiseChannels);
  return sortedDayWiseChannels;
}

async function getYearWiseSortedMessageCountChannel(guildId) {
  const allChannels = await getGuildChannels(guildId);
  const textAndVoiceChannels = [];
  allChannels.forEach((channel) => {
    if (channel.type === 0 || channel.type === 2) {
      const { id, name } = channel;
      const minChannel = { id, name };
      textAndVoiceChannels.push(minChannel);
    }
  });
  const yearWiseMessageCountofChannels = [];
  for (const channel of textAndVoiceChannels) {
    const yearData = await getYearWiseMessageCount(channel.id);
    yearData.id = channel.id;
    yearData.name = channel.name;
    yearWiseMessageCountofChannels.push(yearData);
  }

  const len = yearWiseMessageCountofChannels.length;

  const sortedYearWiseChannels = {};

  for (let i = 0; i < len; i++) {
    const currChannel = yearWiseMessageCountofChannels[i];
    Object.keys(currChannel).forEach((year) => {
      if (year === "id" || year === "name") {
        return;
      }
      const sorted = [];
      sorted.push({
        id: currChannel.id,
        name: currChannel.name,
        count: currChannel[year],
      });
      for (let k = 0; k < i; k++) {
        const channelWithout = yearWiseMessageCountofChannels[k];
        sorted.push({
          id: channelWithout.id,
          name: channelWithout.name,
          count: 0,
        });
      }
      for (let j = i + 1; j < len; j++) {
        const compareChannel = yearWiseMessageCountofChannels[j];
        if (compareChannel.hasOwnProperty(year)) {
          sorted.push({
            id: compareChannel.id,
            name: compareChannel.name,
            count: compareChannel[year],
          });
          delete compareChannel[year];
        } else {
          sorted.push({
            id: compareChannel.id,
            name: compareChannel.name,
            count: 0,
          });
        }
      }
      sorted.sort((a, b) => {
        return a.count - b.count;
      });
      sortedYearWiseChannels[year] = sorted;
    });
  }

  console.log(sortedYearWiseChannels);
  return sortedYearWiseChannels;
}

async function getChannelsSortedOnMessageCount(guildId, timeframeInDays) {
  const timeInDays = Number(timeframeInDays);
  const channels = await getTextandVoiceChannels(guildId);
  const compareTime = moment().subtract(timeInDays, "d");
  const channelDetails = [];
  for (let channel of channels) {
    let channelMessageCount = 0;
    const messagesOfChannel = await viewMessagesInAChannel(channel.id);
    for (let message of messagesOfChannel) {
      if (compareTime.isBefore(message.timestamp)) {
        channelMessageCount++;
      }
    }
    channelDetails.push({
      channelName: channel.name,
      messageCount: channelMessageCount,
    });
  }

  channelDetails.sort((a, b) => {
    return a.messageCount - b.messageCount;
  });

  channelDetails.forEach((channel) => {
    channel.averageMessagePerDay = (channel.messageCount / timeInDays).toFixed(
      2
    );
  });

  return channelDetails;
}

//getChannelsSortedOnMessageCount("1044887003868713010", "30");

async function getUsersJoinedWithin(guildId, timeframe) {
  const timeInDays = Number(timeframe);
  const members = await getGuildMembers(guildId);
  const compareTime = moment().subtract(timeInDays, "d");
  const userDetails = [];
  for (let member of members) {
    if (compareTime.isBefore(member.joined_at)) {
      const minUser = {};
      minUser.username = member.user.username;
      minUser.joined_at = moment(member.joined_at).format("lll");
      userDetails.push(minUser);
    }
  }

  const data = {};
  data.joinedUserCount = userDetails.length;
  data.joinedUsers = userDetails;

  //console.log(data);
  return data;
}

//getUsersJoinedWithin("1044887003868713010", "10");
//findTotalUsersAndOnlineUsers(process.env.GUILD_ID);
//sortChannelsByMessageCount(process.env.GUILD_ID);
//viewMessagesInAChannel("1051400474563182592");
//getHourWiseUserJoinCount(process.env.GUILD_ID);
//getYearWiseSortedMessageCountChannel(process.env.GUILD_ID);
module.exports = {
  findTotalUsersAndOnlineUsers,
  getGuildDetails,
  getTextandVoiceChannels,
  getChannel,
  getGuildMembers,
  viewMessagesInAChannel,
  searchGuildMember,
  getChannelsSortedOnMessageCount,
  getUsersJoinedWithin,
  getGuildMember,
};
