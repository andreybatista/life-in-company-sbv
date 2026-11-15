import {Action} from '@/components/conversion'
import {SiteFrame} from '@/components/site-frame'

export const metadata = {title: 'Página não encontrada | Life in Company SBV'}

export default function NotFound() {
  return <SiteFrame>
    <main className="flex items-center bg-sand text-[0.875rem] text-foreground [&_[data-button]]:[font-size:inherit]!">
      <div className="site-container w-full py-20 text-center">
        <p className="font-bold uppercase tracking-wide">Erro 404</p>
        <h1 className="mt-4 text-balance leading-tight font-bold">
          Página não encontrada
        </h1>
        <p className="mt-4">Confira o endereço ou volte à página inicial.</p>
        <Action final button={{label: 'Voltar à página inicial', href: '/'}} />
      </div>
    </main>
  </SiteFrame>
}
