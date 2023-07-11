import { RedocStandalone } from 'redoc';
import { baseSchema } from '~/utils/openapi';


export default function Redoc() {
  return (
    <><RedocStandalone spec={baseSchema} /></>
  )
}
