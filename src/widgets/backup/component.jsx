import { useTranslation } from "next-i18next";
import Container from "components/services/widget/container";
import Block from "components/services/widget/block";

import useWidgetAPI from "utils/proxy/use-widget-api";

function renderDate(t, date, threshold) {
  const now = Date.now();
  const backupColor = Date.parse(date) < now - threshold ? "bg-rose-500" : "bg-emerald-500";
  return (
    <div className="flex items-center gap-2">
      {t("common.date", { value: date, dateStyle: "medium" })}
      <div className={`rounded-full h-3 w-3 ${backupColor}`} />
    </div>
  );
}

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;
  const { data, error } = useWidgetAPI(widget, "query", {
    db: "backups",
    q: "SELECT size FROM backup WHERE stage='backup' ORDER BY time DESC LIMIT 1;SELECT size FROM backup WHERE stage='upload' ORDER BY time DESC LIMIT 1",
    refreshInterval: 300000,
  });

  if (error) {
    return <Container service={service} error={error} />;
  }

  if (!data) {
    return (
      <Container service={service}>
        <Block label="backup.backupTime" />
        <Block label="backup.backupSize" />
        <Block label="backup.uploadTime" />
        <Block label="backup.uploadSize" />
      </Container>
    );
  }

  const backupValues = data.results[0].series[0].values[0];
  const uploadValues = data.results[1].series[0].values[0];
  return (
    <Container service={service}>
      <Block label="backup.backupTime" value={renderDate(t, backupValues[0], 129600000)} />
      <Block label="backup.backupSize" value={t("common.bytes", { value: backupValues[1] })} />
      <Block label="backup.uploadTime" value={renderDate(t, uploadValues[0], 691200000)} />
      <Block label="backup.uploadSize" value={t("common.bytes", { value: uploadValues[1] })} />
    </Container>
  );
}
