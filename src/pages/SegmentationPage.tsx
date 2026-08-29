import { DEVICE_SEGMENTS } from '@/data/constants'
import { getDataset } from '@/data'
import { conversionRateByDevice, rangeFromPreset } from '@/data/selectors'
import { DeviceConversionChart } from '@/features/segmentation/DeviceConversionChart'

export function SegmentationPage() {
  const dataset = getDataset()
  const range = rangeFromPreset(dataset, '30d')

  const data = DEVICE_SEGMENTS.map((device) => ({
    device,
    conversionRate: conversionRateByDevice(dataset, device, range),
  }))

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-ink">Segmentation</h1>
      <DeviceConversionChart data={data} />
    </div>
  )
}
