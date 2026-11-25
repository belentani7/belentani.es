'use client';

import { useTranslation } from '@/lib/i18n';
import GalaxyVoyage from '@/components/voyage/GalaxyVoyage';
import styles from './HumanBecoming.module.css';

export default function HomeClient() {
  const { t } = useTranslation();
  return (
    <>
      <GalaxyVoyage />
      <section className={styles.scene} aria-labelledby="human-becoming-title">
        <div className={styles.light} aria-hidden="true" />
        <div className={styles.inner}>
          <div className={styles.heading}>
            <p className={styles.index}>02 / EL SENTIDO DE LA OBRA</p>
            <h2 id="human-becoming-title">HUMAN<br />{' '}<span>BECOMING</span></h2>
            <p className={styles.statement}>Una historia en desarrollo. Una voz que cambia de forma sin perder su origen.</p>
            <p className={styles.detail}>De São Paulo a Barcelona, Belentani une música, imagen y relato para explorar memoria, contradicción y transformación. JUDAS es una puerta a ese universo.</p>
          </div>
          <div className={styles.constellation} aria-label="Tres símbolos de la obra: Espejo, Llave y Diamante">
            <span className={styles.ring} aria-hidden="true" />
            <a className={styles.symbol} href="/lore#espejo" aria-label="El espejo: identidad"><span aria-hidden="true">◈</span><strong>Espejo</strong><small>IDENTIDAD</small></a>
            <a className={styles.symbol} href="/lore#llave" aria-label="La llave: umbral"><span aria-hidden="true">✦</span><strong>Llave</strong><small>UMBRAL</small></a>
            <a className={styles.symbol} href="/galeria" aria-label="Diamante: explorar la galería de mundos"><span aria-hidden="true">◇</span><strong>Diamante</strong><small>TRANSFORMACIÓN</small></a>
          </div>
          <nav className={styles.routes} aria-label="Recorrer la obra">
            <a href="/lore"><span>01 / RELATO</span><strong>Entrar en el lore</strong><b aria-hidden="true">↗</b></a>
            <a href="/musica"><span>02 / SONIDO</span><strong>Escuchar la obra</strong><b aria-hidden="true">↗</b></a>
            <a href="/artista"><span>03 / PERSONA</span><strong>Conocer al artista</strong><b aria-hidden="true">↗</b></a>
            <a href="/omega-living.html"><span>04 / MUNDO RECUPERADO</span><strong>Entrar en OMEGA Living</strong><b aria-hidden="true">↗</b></a>
            <a href="/galeria"><span>05 / IMAGEN</span><strong>Explorar los mundos</strong><b aria-hidden="true">↗</b></a>
            <a href="/ai-lab"><span>06 / EXPERIMENTACIÓN</span><strong>Entrar en el laboratorio</strong><b aria-hidden="true">↗</b></a>
          </nav>
          <p className={styles.signature}>{t('home.hero.title')} <span aria-hidden="true">·</span> {t('home.hero.sub')}</p>
        </div>
      </section>
    </>
  );
}
