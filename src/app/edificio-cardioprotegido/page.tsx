import {ServicePage} from '@/components/service-page'
import {serviceMetadata} from '@/sanity/services'

export const generateMetadata = () => serviceMetadata('edificioCardioprotegido')

export default function Page() {
  return <ServicePage id="edificioCardioprotegido" />
}
