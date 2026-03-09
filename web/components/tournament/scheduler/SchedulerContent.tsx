"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Lock, Calendar, Clock } from "lucide-react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function SchedulerContent() {
  const [startDate, setStartDate] = useState("");
  const [timezone, setTimezone] = useState("Asia/Karachi");
  const [defaultTimezone, setDefaultTimezone] = useState(true);
  const [excludedDates, setExcludedDates] = useState<string[]>([]);
  const [excludedInput, setExcludedInput] = useState("");
  const [daySlots, setDaySlots] = useState<
    Record<string, { enabled: boolean; start: string; end: string }>
  >(
    DAYS.reduce(
      (acc, d) => ({
        ...acc,
        [d]: { enabled: false, start: "", end: "" },
      }),
      {},
    ),
  );
  const [locations, setLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [referees, setReferees] = useState<string[]>([]);
  const [refereeInput, setRefereeInput] = useState("");
  const [matchDurationHours, setMatchDurationHours] = useState("0");
  const [matchDurationMinutes, setMatchDurationMinutes] = useState("0");
  const [restDays, setRestDays] = useState("0");
  const [restHours, setRestHours] = useState("0");
  const [restMinutes, setRestMinutes] = useState("0");
  const [overrideSchedule, setOverrideSchedule] = useState(false);
  const [scheduling, setScheduling] = useState(false);

  function addExcludedDate() {
    const trimmed = excludedInput.trim();
    if (trimmed && !excludedDates.includes(trimmed)) {
      setExcludedDates((prev) => [...prev, trimmed]);
      setExcludedInput("");
    }
  }

  function removeExcludedDate(date: string) {
    setExcludedDates((prev) => prev.filter((d) => d !== date));
  }

  function addLocation() {
    const trimmed = locationInput.trim();
    if (trimmed && !locations.includes(trimmed)) {
      setLocations((prev) => [...prev, trimmed]);
      setLocationInput("");
    }
  }

  function removeLocation(loc: string) {
    setLocations((prev) => prev.filter((l) => l !== loc));
  }

  function addReferee() {
    const trimmed = refereeInput.trim();
    if (trimmed && !referees.includes(trimmed)) {
      setReferees((prev) => [...prev, trimmed]);
      setRefereeInput("");
    }
  }

  function removeReferee(ref: string) {
    setReferees((prev) => prev.filter((r) => r !== ref));
  }

  function setDaySlot(
    day: string,
    field: "enabled" | "start" | "end",
    value: boolean | string,
  ) {
    setDaySlots((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  }

  async function handleScheduleMatches() {
    setScheduling(true);
    try {
      // Placeholder: in a full implementation this would call the API
      await new Promise((r) => setTimeout(r, 800));
    } finally {
      setScheduling(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
  const labelClass = "text-sm font-medium text-foreground mb-1 block";

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Date & Time */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Date & Time</h2>
        <div>
          <label className={labelClass}>Start Date</label>
          <div className="relative">
            <input
              type="text"
              placeholder="MM/DD/YYYY"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass + " pr-10"}
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Timezone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className={inputClass}
          >
            <option value="Asia/Karachi">Asia/Karachi</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={defaultTimezone}
            onChange={(e) => setDefaultTimezone(e.target.checked)}
            className="rounded border-input text-primary"
          />
          <span className="text-sm text-foreground">
            Set this as the tournament&apos;s default timezone
          </span>
        </label>
      </section>

      {/* Excluded Dates - CRUD */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Excluded Dates
        </h2>
        <p className="text-sm text-muted-foreground">
          Specify dates when matches cannot be scheduled, such as public
          holidays, venue closures, or team unavailability.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. 12/25/2025"
            value={excludedInput}
            onChange={(e) => setExcludedInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addExcludedDate())
            }
            className={inputClass}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addExcludedDate}
            className="shrink-0"
          >
            Exclude Dates
          </Button>
        </div>
        {excludedDates.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {excludedDates.map((d) => (
              <li
                key={d}
                className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-sm"
              >
                {d}
                <button
                  type="button"
                  onClick={() => removeExcludedDate(d)}
                  className="p-0.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                  aria-label={`Remove ${d}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Day and Time Slots */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Day and Time Slots
        </h2>
        <p className="text-sm text-muted-foreground">
          Select the days of the week and time ranges when matches are allowed
          to be scheduled.
        </p>
        <div className="space-y-3">
          {DAYS.map((day) => (
            <div
              key={day}
              className="flex flex-wrap items-center gap-3 rounded-md border p-3"
            >
              <label className="flex items-center gap-2 shrink-0">
                <input
                  type="checkbox"
                  checked={daySlots[day]?.enabled ?? false}
                  onChange={(e) => setDaySlot(day, "enabled", e.target.checked)}
                  className="rounded border-input text-primary"
                />
                <span className="text-sm font-medium">{day}</span>
              </label>
              <input
                type="text"
                placeholder="hh:mm aa"
                value={daySlots[day]?.start ?? ""}
                onChange={(e) => setDaySlot(day, "start", e.target.value)}
                className="w-28 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
              />
              <input
                type="text"
                placeholder="hh:mm aa"
                value={daySlots[day]?.end ?? ""}
                onChange={(e) => setDaySlot(day, "end", e.target.value)}
                className="w-28 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
              />
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* Locations - CRUD */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Locations</h2>
        <p className="text-sm text-muted-foreground">
          List the venues where matches can be played (optional).
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Venue name"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addLocation())
            }
            className={inputClass}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addLocation}
            className="shrink-0"
          >
            Add Location
          </Button>
        </div>
        {locations.length > 0 && (
          <ul className="space-y-2">
            {locations.map((loc) => (
              <li
                key={loc}
                className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm"
              >
                {loc}
                <button
                  type="button"
                  onClick={() => removeLocation(loc)}
                  className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                  aria-label={`Delete ${loc}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Referees - CRUD */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Referees</h2>
        <p className="text-sm text-muted-foreground">
          Add available referees who will be automatically assigned to matches
          (optional).
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Referee name"
            value={refereeInput}
            onChange={(e) => setRefereeInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addReferee())
            }
            className={inputClass}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addReferee}
            className="shrink-0"
          >
            Add Referee
          </Button>
        </div>
        {referees.length > 0 && (
          <ul className="space-y-2">
            {referees.map((ref) => (
              <li
                key={ref}
                className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm"
              >
                {ref}
                <button
                  type="button"
                  onClick={() => removeReferee(ref)}
                  className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                  aria-label={`Delete ${ref}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Match Settings */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Match Settings
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className={labelClass}>Match Duration Estimate</p>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                value={matchDurationHours}
                onChange={(e) => setMatchDurationHours(e.target.value)}
                className={inputClass}
              />
              <span className="self-center text-sm text-muted-foreground">
                Hours
              </span>
              <input
                type="number"
                min={0}
                value={matchDurationMinutes}
                onChange={(e) => setMatchDurationMinutes(e.target.value)}
                className={inputClass}
              />
              <span className="self-center text-sm text-muted-foreground">
                Minutes
              </span>
            </div>
          </div>
          <div className="sm:col-span-2">
            <p className={labelClass}>Minimum Resting Time For Participants</p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="number"
                min={0}
                value={restDays}
                onChange={(e) => setRestDays(e.target.value)}
                className="w-20 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
              />
              <span className="text-sm text-muted-foreground">Days</span>
              <input
                type="number"
                min={0}
                value={restHours}
                onChange={(e) => setRestHours(e.target.value)}
                className="w-20 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
              />
              <span className="text-sm text-muted-foreground">Hours</span>
              <input
                type="number"
                min={0}
                value={restMinutes}
                onChange={(e) => setRestMinutes(e.target.value)}
                className="w-20 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
              />
              <span className="text-sm text-muted-foreground">Minutes</span>
            </div>
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={overrideSchedule}
            onChange={(e) => setOverrideSchedule(e.target.checked)}
            className="rounded border-input text-primary"
          />
          <span className="text-sm text-foreground">
            Override schedule for matches with already set dates
          </span>
        </label>
      </section>

      <Button
        onClick={handleScheduleMatches}
        disabled={scheduling}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 px-6 py-3 text-base font-medium"
      >
        <Lock className="h-5 w-5" />
        {scheduling ? "Scheduling…" : "Schedule Matches"}
      </Button>
    </div>
  );
}
