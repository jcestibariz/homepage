import { useTranslation } from "next-i18next";
import Container from "components/services/widget/container";
import Block from "components/services/widget/block";

import useWidgetAPI from "utils/proxy/use-widget-api";

const getValues = (data, index, dft = [0]) => data.results[index].series?.[0]?.values?.[0] ?? dft;

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;
  const host = widget.host;
  const { data, error } = useWidgetAPI(widget, "query", {
    db: "telegraf",
    q: `SELECT uptime, load5 FROM system WHERE host='${host}' ORDER BY time DESC LIMIT 1;SELECT usage_idle FROM cpu WHERE cpu='cpu-total' AND host='${host}' ORDER BY time DESC LIMIT 1;SELECT used_percent FROM mem WHERE host='${host}' ORDER BY time DESC LIMIT 1;SELECT used_percent FROM disk WHERE path='/' AND host='${host}' ORDER BY time DESC LIMIT 1`,
  });

  if (error) {
    return <Container service={service} error={error} />;
  }

  if (!data) {
    return (
      <Container service={service}>
        <Block label="resources.uptime" />
        <Block label="resources.load" />
        <Block label="resources.cpu" />
        <Block label="resources.mem" />
        <Block label="telegraf.rootfs" />
      </Container>
    );
  }

  const systemValues = getValues(data, 0, [0, 0]);
  const cpuValues = getValues(data, 1, [100]);
  const memValues = getValues(data, 2);
  const diskValues = getValues(data, 3);
  return (
    <Container service={service}>
      <Block label="resources.uptime" value={t("common.duration", { value: systemValues[1] })} />
      <Block label="resources.load" value={t("common.percent", { value: systemValues[2] })} />
      <Block label="resources.cpu" value={t("common.percent", { value: 100 - cpuValues[1] })} />
      <Block label="resources.mem" value={t("common.percent", { value: memValues[1] })} />
      <Block label="telegraf.rootfs" value={t("common.percent", { value: diskValues[1] })} />
    </Container>
  );
}
