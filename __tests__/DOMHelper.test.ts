// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
//
// SPDX-License-Identifier: MIT

import getLocalizedStrings from "../src/localization";
import Config from "../src/models/Config";
import { bodyHasJitsiLink, getJitsiLinkDiv, overwriteJitsiLinkDiv } from "../src/utils/DOMHelper";
import * as URLHelper from "../src/utils/URLHelper";

describe("getJitsiLinkDOM", () => {
  it("should return a string that contains the correct Jitsi URL", () => {
    const config: Config = {};
    const jitsiUrl = URLHelper.getJitsiUrl(config);
    const jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);

    expect(jitsiLinkDOM).toContain(jitsiUrl);
  });

  it("should return a string that contains the localized strings", () => {
    const config: Config = {};
    const jitsiUrl = URLHelper.getJitsiUrl(config);
    const jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);
    const localizedStrings = getLocalizedStrings();

    expect(jitsiLinkDOM).toContain(localizedStrings.linkToMeeting);
    expect(jitsiLinkDOM).toContain(localizedStrings.connectToMeeting);
  });

  it("should include the additionalText if provided in config", () => {
    const config: Config = {
      additionalText: "This is additional text",
    };
    const jitsiUrl = URLHelper.getJitsiUrl(config);
    const jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);

    expect(jitsiLinkDOM).toContain(config.additionalText);
  });

  it("should not include the additionalText if not provided in config", () => {
    const config: Config = {};
    const jitsiUrl = URLHelper.getJitsiUrl(config);
    const jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);

    expect(jitsiLinkDOM).not.toContain("additionalText");
  });
});

describe("bodyHasJitsiLink", () => {
  it("should return true if body contains Jitsi link", () => {
    const body = "Join my Jitsi Meet at https://meet.jit.si/mymeeting";
    const config: Config = {
      baseUrl: "https://meet.jit.si/",
    };

    expect(bodyHasJitsiLink(body, config)).toBe(true);
  });

  it("should return false if body does not contain Jitsi link", () => {
    const body = "Join my meeting at https://zoom.us/mymeeting";
    const config: Config = { baseUrl: "https://meet.jit.si/" };

    expect(bodyHasJitsiLink(body, config)).toBe(false);
  });

  it("should use default Jitsi URL if baseUrl is not provided in config", () => {
    const body = "Join my Jitsi Meet at https://meet.jit.si/mymeeting";
    const config: Config = {};

    expect(bodyHasJitsiLink(body, config)).toBe(true);
  });
});

describe("overwriteJitsiLinkDiv", () => {
  it("should replace the existing jisti div with a new one", () => {
    const config: Config = {
      baseUrl: "https://meet.jit.si",
    };
    const oldRoomName = config.baseUrl + "/room-name";
    const newRoomName = config.baseUrl + "/new-room-name";
    // Mock the return value of getJitsiUrl
    jest.spyOn(URLHelper, "getJitsiUrl").mockReturnValue(newRoomName);

    const dom = `
    <div id="jitsi-link">
        <a style="font-size: 1.5em;" href="${oldRoomName}">
            link
        </a>
    </div>
    `;

    const body = new DOMParser().parseFromString(dom, "text/html");
    expect(body.body.innerHTML).toContain(oldRoomName);

    const result = overwriteJitsiLinkDiv(body, config);
    expect(result).toContain(newRoomName);
    expect(result).not.toContain(oldRoomName);
  });
});
