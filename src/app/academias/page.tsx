import {ServicePage} from '@/components/service-page'
import {serviceMetadata} from '@/sanity/services'

export const generateMetadata = () => serviceMetadata('academias')

export default function Page() {
  return <ServicePage id="academias" />
}
