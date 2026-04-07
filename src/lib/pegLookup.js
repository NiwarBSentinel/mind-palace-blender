const PEG_MAP = {
  '00':'Sauce','01':'Seed','02':'Sun','03':'Sumo','04':'Sir','05':'Soul','06':'Sushi','07':'Ski','08':'Sofa','09':'Soap',
  '10':'Dice','11':'Dad','12':'DNA','13':'Adam','14':'Thor','15':'Adele','16':'DJ','17':'Dog','18':'TV','19':'Tuba',
  '20':'Nose','21':'Net','22':'Nun','23':'Nemo','24':'Nero','25':'Nail','26':'Nacho','27':'Ink','28':'Knife','29':'NBA',
  '30':'Mouse','31':'Mat','32':'Moon','33':'Mummy','34':'Mario','35':'Mole','36':'Match','37':'Mickey','38':'Mafia','39':'Map',
  '40':'Rose','41':'Radio','42':'Rain','43':'Rum','44':'Error','45':'Ariel','46':'Arch','47':'Rocky','48':'Roof','49':'Harp',
  '50':'Lasso','51':'Lady','52':'Lion','53':'Lime','54':'Hillary','55':'Lily','56':'Leech','57':'Leek','58':'Lava','59':'Lip',
  '60':'Cheese','61':'Cheetah','62':'Genie','63':'Jam','64':'Cherry','65':'Chilli','66':'Yo-yo','67':'Chick','68':'Chef','69':'Ship',
  '70':'Goose','71':'Cat','72':'Gun','73':'Gum','74':'Car','75':'Koala','76':'Cage','77':'Cake','78':'Coffee','79':'Cube',
  '80':'Vase','81':'Foot','82':'Fan','83':'Foam','84':'Fire','85':'Fly','86':'Fish','87':'Fig','88':'FIFA','89':'Phoebe',
  '90':'Bus','91':'Bat','92':'Piano','93':'Beam','94':'Beer','95':'Apple','96':'Bush','97':'Book','98':'Beef','99':'Pope',
}

export function parsePegNumber(numStr) {
  const digits = (numStr || '').replace(/\D/g, '')
  if (!digits) return []
  const padded = digits.length % 2 === 1 ? digits.slice(0, -1) + '0' + digits.slice(-1) : digits
  const pairs = []
  for (let i = 0; i < padded.length; i += 2) {
    const pair = padded.substring(i, i + 2)
    pairs.push({ num: pair, word: PEG_MAP[pair] || '?' })
  }
  return pairs
}
