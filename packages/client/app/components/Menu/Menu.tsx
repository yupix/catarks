import { Link, useLocation } from "@remix-run/react";

interface IMenuProps {
    sections: {title: string;
        links: Array<{title: string, link: string, label?: string} | null>, firstDivider?: boolean}[]
}

export function Menu({sections}: IMenuProps) {
    const location = useLocation()
    return (<>

          {sections.map((section, i) => {
            return (
              <>
                {section.firstDivider && <li key={`${section.title}-${i}`}></li>}
                <li className="menu-title" key={section.title}>
                  <Link to="">
                    <span>{section.title}</span>
                  </Link>
                </li>
                {section.links.map((link) => {
                  return link && <li key={link.title}>
                      <Link to={link.link} className={`${location.pathname === link.link  ? 'active' : ''}`}>
                        {link.title}{link.label &&  <span className="badge">{link.label}</span>}
                      </Link>
                    </li>
                  ;
                })}
                {sections.length-1 !== i && <li key={`${section.title}-${i}-last`}></li>}
                
              </>
            );
          })}
    </>

    )
}