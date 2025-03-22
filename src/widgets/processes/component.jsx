import { useTranslation } from "next-i18next";
import Container from "components/services/widget/container";
import Block from "components/services/widget/block";

import useWidgetAPI from "utils/proxy/use-widget-api";

function color(alive, count) {
  return count < 5 ? "bg-orange-400" : alive ? "bg-emerald-500" : "bg-rose-500";
}

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;
  const { data, error } = useWidgetAPI(widget, "processes");

  if (error) {
    return <Container service={service} error={error} />;
  }

  if (!data) {
    return (
      <Container service={service}>
        <Block label="processes.state" />
      </Container>
    );
  }

  return (
    <Container service={service}>
      <Block
        label="processes.state"
        value={
          <ul>
            {data.map(({ name, alive, count }) => (
              <li key={name} className="flex items-center gap-2">
                <div
                  className={`rounded-full h-3 w-3 ${color(alive, count)}`}
                  title={`Last state: ${alive ? "alive" : "dead"}, time: ${t("common.duration", { value: count * 15 })}`}
                />
                {name}
              </li>
            ))}
          </ul>
        }
      />
    </Container>
  );
}
