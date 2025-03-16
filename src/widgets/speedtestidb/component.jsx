import { useTranslation } from "next-i18next";
import Container from "components/services/widget/container";
import Block from "components/services/widget/block";

import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;
  const { data, error } = useWidgetAPI(widget, "query", {
    db: "network",
    q: "SELECT mean(bandwidth) FROM download WHERE time >= now() - 24h ORDER BY time DESC LIMIT 1;SELECT mean(bandwidth) FROM upload WHERE time >= now() - 24h ORDER BY time DESC LIMIT 1;SELECT mean(avg) FROM ping WHERE time >= now() - 24h ORDER BY time DESC LIMIT 1"
  });

  if (error) {
    return <Container service={service} error={error} />;
  }

  if (!data) {
    return (
      <Container service={service}>
        <Block label="speedtest.download" />
        <Block label="speedtest.upload" />
        <Block label="speedtest.ping" />
      </Container>
    );
  }

  const bitratePrecision =
    !widget?.bitratePrecision || Number.isNaN(widget?.bitratePrecision) || widget?.bitratePrecision < 0
      ? 0
      : widget.bitratePrecision;

  const download = data.results[0].series[0].values[0][1];
  const upload = data.results[1].series[0].values[0][1];
  const ping = data.results[2].series[0].values[0][1];
  return (
    <Container service={service}>
      <Block
        label="speedtest.download"
        value={t("common.bitrate", {
          value: download * 1000 * 1000,
          decimals: bitratePrecision,
        })}
      />
      <Block
        label="speedtest.upload"
        value={t("common.bitrate", {
          value: upload * 1000 * 1000,
          decimals: bitratePrecision,
        })}
      />
      <Block
        label="speedtest.ping"
        value={t("common.ms", {
          value: ping,
          style: "unit",
          unit: "millisecond",
        })}
      />
    </Container>
  );
}
