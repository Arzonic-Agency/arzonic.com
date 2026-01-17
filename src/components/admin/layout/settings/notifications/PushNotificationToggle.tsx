"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createClient } from "@/utils/supabase/client";
import { updateUserPushNotificationPreference } from "@/lib/server/subscribe";

const PushNotificationToggle = () => {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState<boolean | null>(null); // null = ikke indlæst endnu
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPreference = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: member, error } = await supabase
        .from("members")
        .select("push_notifications_enabled")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Fejl ved hentning af push notification preference:", error);
        setEnabled(true); // Default til true ved fejl
      } else if (member) {
        // Brug værdien fra databasen, eller true hvis null/undefined
        // (kolonnen har DEFAULT true, men eksisterende rækker kan have null)
        const preferenceValue = member.push_notifications_enabled ?? true;
        setEnabled(preferenceValue);
      } else {
        setEnabled(true); // Default til true hvis member ikke findes
      }

      setLoading(false);
    };

    fetchPreference();
  }, []);

  const handleToggle = async (checked: boolean) => {
    setSaving(true);
    const previousValue = enabled;
    
    // Optimistisk opdatering - sæt værdien med det samme
    setEnabled(checked);
    
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("Bruger ikke fundet");
        setEnabled(previousValue); // Revert til forrige værdi
        setSaving(false);
        return;
      }

      const result = await updateUserPushNotificationPreference(user.id, checked);
      
      if (result.success) {
        // Værdien er allerede sat via optimistisk opdatering
      } else {
        console.error("Fejl ved opdatering:", result.error);
        // Revert til forrige værdi hvis fejl
        setEnabled(previousValue);
      }
    } catch (error) {
      console.error("Fejl ved opdatering af push notification preference:", error);
      // Revert til forrige værdi hvis fejl
      setEnabled(previousValue);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <span className="loading loading-spinner loading-sm"></span>
        <span className="text-sm">{t("loading") || "Loading..."}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h5 className="font-semibold text-base">
            {t("push_notifications") || "Push Notifications"}
          </h5>
          <p className="text-sm text-base-content/70">
            {t("push_notifications_description") ||
              "Modtag push notifications når der oprettes nye requests eller beskeder"}
          </p>
        </div>
        <input
          type="checkbox"
          checked={enabled ?? false}
          onChange={(e) => handleToggle(e.target.checked)}
          disabled={saving || loading}
          className="toggle toggle-primary"
        />
      </div>
      {!enabled && (
        <div className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span className="text-sm">
            {t("push_notifications_disabled") ||
              "Push notifications er deaktiveret. Du vil stadig modtage notifications i appen, men ikke som push beskeder."}
          </span>
        </div>
      )}
    </div>
  );
};

export default PushNotificationToggle;
