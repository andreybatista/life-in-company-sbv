import {ServicePage} from '@/components/service-page'
import {serviceMetadata} from '@/sanity/services'

export const generateMetadata = () => serviceMetadata('clinicasHospitais')

export default function Page() {
  return <ServicePage id="clinicasHospitais" />
}
