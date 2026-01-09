"use client";

import type { ApexOptions } from "apexcharts";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type PageMetric = { x: string; y: number };

const solutions = [
  { key: "web-applications", nameKey: "web-applications" },
  { key: "design-ux", nameKey: "design-ux" },
  { key: "3d-visualization", nameKey: "visualization" },
  { key: "systems-integrations", nameKey: "systems-integration" },
];

type ApexChartsInstance = {
  render: () => void;
  updateOptions: (
    options: ApexOptions,
    redraw?: boolean,
    animate?: boolean
  ) => void;
  updateSeries: (series: unknown[], animate?: boolean) => void;
  destroy: () => void;
};

type ApexChartsConstructor = new (
  element: HTMLElement,
  options: ApexOptions
) => ApexChartsInstance;

const PieChart = () => {
  const { t } = useTranslation();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<ApexChartsInstance | null>(null);
  const apexchartsModuleRef = useRef<ApexChartsConstructor | null>(null);

  const [labels, setLabels] = useState<string[]>([]);
  const [series, setSeries] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/umami?period=365d");
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const payload = (await res.json()) as { pages?: PageMetric[] };
        const pages = Array.isArray(payload?.pages) ? payload.pages : [];

        const solutionAggregates = solutions.map((sol) => {
          const basePath = `/solutions/${sol.key}`;

          const total = pages
            .filter((p) => {
              const path = p.x || "";
              return path.startsWith(basePath);
            })
            .reduce((sum, p) => sum + (p.y || 0), 0);

          return {
            name: t(`SolutionsPage.${sol.nameKey}`),
            total,
          };
        });

        const filtered = solutionAggregates.filter((s) => s.total > 0);

        if (filtered.length === 0) {
          setLabels(solutions.map((s) => t(`SolutionsPage.${s.nameKey}`)));
          setSeries(solutions.map(() => 0));
        } else {
          setLabels(filtered.map((s) => s.name));
          setSeries(filtered.map((s) => s.total));
        }
      } catch (err) {
        console.error("Failed to load solution analytics", err);
        setError(
          t("analytics.error", { defaultValue: "Kan ikke hente data lige nu." })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  useEffect(() => {
    let active = true;

    const renderChart = async () => {
      if (!chartContainerRef.current) return;
      if (labels.length === 0) return;

      if (!apexchartsModuleRef.current) {
        const mod = await import("apexcharts");
        if (!active) return;
        const ApexChartsDefault = (mod as { default?: ApexChartsConstructor })
          .default;
        const ApexChartsModule = mod as unknown as ApexChartsConstructor;
        apexchartsModuleRef.current = ApexChartsDefault ?? ApexChartsModule;
      }

      const ApexChartsLib = apexchartsModuleRef.current;
      if (!ApexChartsLib) return;

      const options: ApexOptions = {
        series,
        chart: {
          type: "pie",
          width: "100%",
          height: "100%",
          background: "transparent",
        },

        // ✅ DETTE er den hvide “ring”/separator du ser
        stroke: {
          show: true,
          width: 3,
          colors: ["#111827"], // evt. brug en bg-farve i stedet for transparent
        },

        labels,
        theme: {
          monochrome: {
            enabled: true,
            color: "#048179",
            shadeTo: "light",
            shadeIntensity: 0.7,
          },
        },
        plotOptions: {
          pie: {
            dataLabels: {
              offset: -18, // var -5 → længere ind i cirklen
              minAngleToShowLabel: 14, // skjul label på meget små slices
            },
          },
        },
        grid: {
          padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
        },
        dataLabels: {
          formatter(val: number, opts) {
            const name = opts.w.globals.labels[opts.seriesIndex] as string;
            const pct = Number.isFinite(val) ? val.toFixed(1) : "0.0";
            return [name, `${pct}%`];
          },
        },
        legend: {
          show: false,
        },
      };

      if (!chartInstanceRef.current) {
        chartInstanceRef.current = new ApexChartsLib(
          chartContainerRef.current,
          options
        );
        chartInstanceRef.current.render();
        return;
      }

      chartInstanceRef.current.updateOptions(options, true, true);
      chartInstanceRef.current.updateSeries(options.series ?? [], true);
    };

    renderChart();

    return () => {
      active = false;
    };
  }, [labels, series]);

  useEffect(() => {
    return () => {
      chartInstanceRef.current?.destroy();
      chartInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="flex-1 bg-base-200 rounded-lg shadow-md p-3 md:p-7 hidden xl:block">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-base-content">
          {t("analytics.visitors_by_solution", {
            defaultValue: "Besøgende pr. løsning (seneste 1 år)",
          })}
        </h3>
      </div>
      {loading ? (
        <div className="min-h-[380px] flex flex-col gap-4">
          <div className="skeleton h-6 w-40" />
          <div className="skeleton rounded-full h-[260px] w-[260px] mx-auto" />
        </div>
      ) : error ? (
        <div className="flex h-64 items-center">
          <p className="text-sm text-error">{error}</p>
        </div>
      ) : (
        <div className="min-h-[380px] flex items-center justify-center pt-5">
          <div
            className="relative w-full max-w-[320px] aspect-square"
            ref={chartContainerRef}
          />
        </div>
      )}
    </div>
  );
};

export default PieChart;
