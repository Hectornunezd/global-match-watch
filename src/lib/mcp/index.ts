import { defineMcp } from "@lovable.dev/mcp-js";
import listLiveMatches from "./tools/list-live-matches";
import listUpcomingMatches from "./tools/list-upcoming-matches";
import getMatch from "./tools/get-match";
import listChannelsByCountry from "./tools/list-channels-by-country";
import listTeams from "./tools/list-teams";

export default defineMcp({
  name: "matchlivenow-mcp",
  title: "MatchLiveNow MCP",
  version: "0.1.0",
  instructions:
    "Tools for MatchLiveNow — the FIFA World Cup 2026 streaming directory. Look up live and upcoming matches, fetch a specific match by slug, list TV/streaming channels for a country, and browse the 48 tournament teams.",
  tools: [listLiveMatches, listUpcomingMatches, getMatch, listChannelsByCountry, listTeams],
});
