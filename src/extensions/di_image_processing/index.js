
// create by scratch3-extension generator
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const formatMessage = require("format-message");
const log = require('../../util/log');

const menuIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAADDBJREFUaEPVWXuQXFWZ/33n3Hv7OdPJ9GM6kxnIy0AgBDESkYCSsKIsIRZa4Dq71lpFlqp1a7WswsHSLfUPS3etVQIqu4EttShG3YLSErAKRaO7YCwsYBdlQgLkYTIz6cdkMq9+3HvPY+vc293TM5lEstNQ5amu6q57+5zz/c7v+37fd84h/Jk3+jO3H28YQH52NotabZevsDoKdWAsn9//ZoBfferU7R63t1e1HK3M6oexIV863zxvCEDX6Ew6YdcfJNu5SUmR5JyPSU/+QzGf+UknQWQLpU9aRF/U8ViPrNclk/KnRUZ/jVxu7lzznBfAysnJlJCyN6HoTth8CEoDSoKiUaha9Xe+ZX14Mp0e7QSIeKW8KlHRB7jtrIHnAZyDpJRM091jyn8EfX0TS82zJIBEqZS3we5wtN5NwPXEmQMp5/szBpLqjNb8+sKq9EgnAOSKk1s4xH7NWBpKhUMSQWoNn/D7iFLfQTT6eHHFimPt850FIFku74hrfINHom+HFNBSgmwb0Bra94NvSiSgqtUnbLf+8dGBgclOAOjXOlYtTTzhOPaNAQNmkRwHwcJpDdg2VK32ep3wuelc7tHmnAsA5E+fvlwr9RhzIpdq1w0XQeGkJvWfIMS0pr+FbSeEUocdT33sVF/2+U4Y3xwjUZi8IkH+XiK2AxonmNb7NMOV0LgVnMcNCF13T3CwPeO96acD+1oGjIw4+WzvD8ixP6SFMMjnpMZX7Xj0wfGuF6a24gZ6vVQa8KM8vZKco2Pd3ac7aXxzrOzISFJ1d6e8VKo+29U1uQaInB4vbY1a9LBlWevgONDV6s+sXPa2UaJaC0CmXN7Fpfous+2M5lz5nvv509nsv4BIvxmGXuiYqVLpzpjGt8B5lICKEvrGYj7zXAtAV7H0zzHHuYcDUPX68Tph53Q+vyBgjla9bZD6/URIMmYUKfgsambIhZgZCGrRs7MBzPczMcwYQUNPKFf9cEM6frL/5MlYzXYO2pyvoWgMolb5ZDmX++Y8A4XiPiuVuouM73vuizHL2nm0p2e6OdHx2doOgN0PYpvrPkPVUw3/o8a3MZqgCTCctUMITGs8b463AGLLdg3OgK4YwbbIiJEUQjxFzN+zNpkspIvl52xG24yo1Nz616cO5j7bAtBbKO5jqdRdOAeAE7PetyNx+xM/PlDB80f8MHzaFrs50FIAmpHWdMaW8e1gG2MZRjNdhDveHUHfSht133cZ2CfWdDvfyZZKz3Ji2w0A3/P2TmQzQxcAoPb9KT/60XsfPwNfGNvDrmZCoTgkLHASsEmc7VRE0EYKz9HMG0bUoq0uNHZdZWPHZRFopQQR7rmoO/qNZQEYm3OH/zjtDD70iyn4QU4LXcbA2JI6hIHYH3GiMoCXZi4Ho8UevzDdkMkpwaPFaSgEacZ/7yU2brkyAgYlCBjqT0XvXRaA8Tl3+PhMO4Bw+pvz+/H+3NOIYw4ztSieKt+Ep858AJzaMvf5lr4dQ4MkXxkAHLdcGQWREuAYuii+TABjVXf4RBsDGoRsZAL/9LavIYEZKE+BCQ+lWgb3l+7GKbnKrN6FqmUbAxZu2RIyAMaG+pPO8hgoVN3hY9PO4IP7p+FLDaUZNiSO4u6BfwUXPrQnQb6POTeBfTOfxkG5CRba4iH0OGht6hseOKBhiQWRvVB6jQvdsNHCrgYATRjqTy6TgYKJgYoz+O/7wxgw00bJxad778N6ehnSIzDfxcH6Fnzb+ww8OEZU2xggKE2I2XWsy52AzQSOTQxgutbVADH/XzP+DgNgcxTMFGSEob7lAig2ADzw6xAAaZOcCP3WKHbHfoSL5SEc9S7B4/J2jKEflp5ffR2oECHpVPEXlz2LValykCymq93Yf+haFKYzIKaD/BEEsdLYscHCrZsbQUxsKL9cFyqbIK46gw/8ehpeIz5D4ilwFQ4RSKkPO8i77RpjjLe4wM5Nv8X63PGgj5EhxhSK01k8/fJ1IRMs7BcwsIFj9+URcCihOwrgv6eDPLCgNZTESP3Zwhg60ra1v8fm/sNGVYI6v5mtjeQeL/fjV4euhZAscCejQjvXc+y+LGSgIwAm5tzhYzVn8IFnlgLQCMIlcpUJduPz2ze+EOaH9jQcrIIOjH7p5Ca8dGJT4GpCaexcx7F7UzRggDgNZePLVKHJOXf4aM0Z/NYzM4GPhq2pHu0qMv9ba4Zc1yS2b3we8Ug1UK75HuGvMAtrSGXhuSNbcHyiP1C5G9dZ+OCmCJjuEICpqjt8pNoEEJovNQMnFVTcppwwK9x0IaM4yWgV1258ET3xmWA73WpBDRRUmwt8zvUdHHjtHRib6sFN6xg+eEnExFNnGJiac4eP1J3Bb/7GMGBqIEI6NoW+7mIAYnw2i4lKOvBtRQSbC2xdM4LVKwth0DbqJrYgvJuQQnRmIaYqKTz72hW4Jp/CbZfaDQb0UHq5mdgwYFzo/gOzcCUwsKKALfmDgTQa82oigj+cuhTHpvphjLyi/1WsyY0F2h+qjlntEEhb9dxirJnOiEmMT6XRo67EzWsTJtkJzvXQyo4AqDuD9x2YQ8yewdb+lxF3qpDKmEtB2eBLG/976jI4tsaWiw8HG2oTlGe3xTETBnMITkNCI6M3Ylt6DSxoQZ0AMFt1h1+vOYMPvXAaGzKvIhWbaRnXtNFUmYIsaNtC1HIDN1tUh7b8fvFGtclA6GoKq+0BXJ1ab9gUxLB8BgyAY541+NMjf0B3dHLhyga1vAYxghVRYDz0mLPdveFKTT9aGAKtgDYALrJWY9uKdeCAALOGVsb58oq52ao3PK7U4M+O/0+bjDaIJ+NCGpGYMT5Uogs9CWjt6BoMXGyvwrUr1jYY4EOp5QKYq4rhMSkHf3JsJDgtW7zpjUZ9OM58+TyfsNqdY/73+UBKKKyze3HdyosDBjTrEIBRpQcfff1QI/00MGgg4kjEYt5CoW/tBZbadZnYCJPY2cWHyS8a65wc3tNjisKOAfCGK5Y9+OArr2JOyCA8jRG2JZGMe40ap+k7FGh6wEIjPhpC3yj/2mJkCY0yteK7Ev3YmsoASgvG+FByuS40O+d+P5lwPvpicRqH52oQWgd+H496QQYODV1EQrtxTZ9q5ILGlvqsYDHGd/Morkr0IGHbkFIJxnBPPG4vb1NfqXj74nH7rnpNwJXhpr1pS7C5D1Z8cb1gQDXjwrhSKKuh8yzuE743bzkInABuWRBCVrXWf59MOg9ny+VnOOi6/9exSq3m74DS93NubQ5PzZZu51Wg9nhe1H2pflpr3xfy55WKuyeXSxaypdJvObFrDADpeveWcpl7WhGWnZjYyyOxT5HwAc87zDm7cTSTGWufp1rV79Ja/CXniCoxrzgsLHDO25pH/ov/e67n5nhdCV2IMftRitMoRkac3kzuIDFaT5EIdK36xUIu9+UWgN7C6T3E1F5wniDGXeXWPl7M53/4pwx7q97nS6XbSeN7mrE4Mwz43q3FbPbJFoBEsdib1PQEi0au1kqBfPEqV+Ku0bGxA3jnO338SlvRtcWBRFJnok7iTTteN/dxMuKutaU8fdUrr5ycveEGOlYovI1z6wec8y1kWYBbP0ycv288nT65QKRXFYu3KWLfZZaVMjczTKszrsIjddKPRzXtZIz+0bKshFTqNebrjxVWZX7XSQa6SqXr41o/QNy6HFJWGOjfFOmE0vgw47yXyOieFhD+Zwu9vV9fMotkS6VPEdEXmBPpCa56zEGqUrCECMpkozQ6kYCu1h5LWmxP+wn2csBkS6WkAnvatvg1MFdZZt9srpjMfELArLxQ0hdK7Y35/pfG+/qqS6dBAD2FwjURZg15Wu2yLcsmZcpiUz40tMfQKMRR6bkfKA8MvLYcw5t9E6XS27s0foH2Sz7z0rJAQnoa9KRU/n+U88/8HHRH69xyqWI9GNOsSE3Kiyxm3Rwh/RGy7KuDCzcTH/E4vFr1v+rAX1VyuUInAEDPpLPl+gHLiWzUjUs+LaWuMLrPEeIhzvmJ8hL3xecE0G5U/tSpNcT5I9p2thtayfPK0hV/1+mL7lXF4t8IYl9hGgPEaFYo+eSE592JgYHauRbpDQEwnftmZi5VNfcOkM5Elfrl8Xy+o7f0TQOjpTPvSUBeZ8MfL4A/dr5b+nPGQEdc4i0a5A0z8BbZc8HT/B8CE3anpzbG9wAAAABJRU5ErkJggg==";
const blockIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAABRBJREFUWEftmF+I1FUUx8+5M7O6u622UwmhWUqwUA9REPkQwQaiRvaHcsqCdWdndn+/m4KYZPVgGj4UGWZG/O79za7ZsphM+WL2B/tDPQQhVCBFUEmBlqHtZtmsiztzv3GXGRnH+ffbbdaEvY/3d865n3vOufd3zmW6zAZfZrw0A9zoiM14+H/lYd/3bzbGvAJgQSgU2tzX17d/MoDpdLppZGRkCMAKIvpUCLHacZzRemzVlRJa6xZjzDIieoGIOqxhZh5raWm5uqurK1PPQsUySqkEgP7CHDO/GolENicSiTO1bFUFtqAAthLRWgAtpcZmzZo1r6en51StRUq/K6WeAPB6yfxZIcRrRPR8NW9XBLZhGx4e/oCI7s4b/p2IPiKih4momZm3u667KSislR8cHGwdHR19H8BdRPQlM2cB3JmP3IcdHR0rOzs7s+VsVwTWWm80xrxslYQQm9rb23fEYrFcOp2+YmxsrKWrq+vkZGCLddLpdHMsFjtr5zzPe5CZ3wYQEkL0Oo5zPmWKdSoCK6W+A3ATER2UUq6cKlw9+kqpQwCWMvNh13XvCORhpZQNk93ts47jvFhOeWhoaE4mk7myHpgyMuOO45wontdabzHGbLUH2nXd5kDAnuehkA6O42wvVfY8bwMR2ZQRkwS2N81hZu4sHDKt9VPGmJesPSll2ehXTIk6gEeIqJ2ZjwMIfLUx8yIATcy8ynXddyxko4HHiShs7+I1a9YMB/WyUmo3gDgRxaWUexoG7Pv+7UKIk9ls9kcAkdmzZ7fH4/HTqVRqUS6XeygcDn+STCa/qbUBz/NSRJRsKLBSajWAvcz8GBG9WQzsed5RIlrMzJnm5ubra3l9WoALi5QCd3d3/621Pg2gjZkBYLGU8pdqXp4u4AEi6innYd/37zXGSCJ613VdVQqbSqUWZLPZNyKRyIZkMvntJQeu5k2l1C1E9B6A+cz8hxBiaS6XW9vwHPY8r6KHtdbWuzc0NTVticfjY4UN+L6/zBhjf7ltRZv6k5k/B/BAQw9dOeDW1tbFmUxmJxHdlwf6noi6pZSH82WkTY9wmQgcI6Lrph2YmU8AuPaCAoU5Zys7AMurpMqvRDR/2oFr3bdVvts6wm60cT+O4pQAMFgh1PXuwRb+10wnsM3NOfXSVZILhUL39/X1HWjIr1kptRPAeiHEOgBXEdGTU/CyrUUORKPRHtsYNARYa73KGJMmolPMvAvA8SAeFkIccRzn60o6/3m1BoC11gcB3BMEtCDLzBtd190xbcB2IQDC9/0kANucRgOA/xCNRp+JxWL/VNJRSj0NYKK7mUwBb5tMe4p3SSnXBwCbtKhSah+AR4jomJRyYTlD1TqOt4joUWb+KxQK3drb2/vzpEnqUNRaLwRwBMBcZt7juq4t7i8aFYH7+/tvHB8f/yp/dZ1k5p3MfMQYs42Z5zHzJsdx9tbBcpGI1joCYDcRLQfwsRDiKAAJIMrMZ8Lh8G3JZPKnQMBWOJVKLcnlcrZwWVBG2b7UzHUcx15PgYZSKp4HLtX7jYgel1J+Vslgzbc1+1xl/0YAYvnXmYkumZlz0Wi0rfAQEoTY87x1RGSfpSaG7Z6FEBrAvlqPgjWBi0GsZ2xza1sjItompXwuCGhBdmBgoO3cuXOHiGgJM38RiURW1PMQOLG5oAvaxYioLZFI2PBNaVhb9YKej8aUVrwEyoE9fAkYL1hyBrjREZjxcKM9/C8LaC9aRU+8jQAAAABJRU5ErkJggg==";

class testExt{
  constructor (runtime){
    this.runtime = runtime;
    // communication related
    this.comm = runtime.ioDevices.comm;
    this.session = null;
    this.runtime.registerPeripheralExtension('testExt', this);
    // session callbacks
    this.reporter = null;
    this.onmessage = this.onmessage.bind(this);
    this.onclose = this.onclose.bind(this);
    this.write = this.write.bind(this);
    // string op
    this.decoder = new TextDecoder();
    this.lineBuffer = '';
  }

  onclose (){
    this.session = null;
  }

  write (data, parser = null){
    if (this.session){
      return new Promise(resolve => {
        if (parser){
          this.reporter = {
            parser,
            resolve
          }
        }
        this.session.write(data);
      })
    }
  }

  onmessage (data){
    const dataStr = this.decoder.decode(data);
    this.lineBuffer += dataStr;
    if (this.lineBuffer.indexOf('\n') !== -1){
      const lines = this.lineBuffer.split('\n');
      this.lineBuffer = lines.pop();
      for (const l of lines){
        if (this.reporter){
          const {parser, resolve} = this.reporter;
          resolve(parser(l));
        };
      }
    }
  }

  scan (){
    this.comm.getDeviceList().then(result => {
        this.runtime.emit(this.runtime.constructor.PERIPHERAL_LIST_UPDATE, result);
    });
  }

  getInfo (){
    return {
      id: 'diImageProcessing',
      name: 'Test',
      color1: '#19D1B9',
      color2: '#19D1B9',
      menuIconURI: menuIconURI,
      blockIconURI: blockIconURI,
      blocks: [
        {
          opcode: 'a',
          blockType: BlockType.COMMAND,
          arguments: {
            TXT: {
              type: ArgumentType.STRING
            },
            X: {
              type: ArgumentType.STRING
            },
            boolean: {
              type: ArgumentType.BOOLEAN
            }
          },
          text: 'block name label text [TXT] [X] [boolean]'
        },
        {
          opcode: 'b',
          blockType: BlockType.REPORTER,
          arguments: {
            TXT: {
              type: ArgumentType.STRING
            },
            X: {
              type: ArgumentType.STRING
            },
            boolean: {
              type: ArgumentType.BOOLEAN
            }
          },
          text: 'block name label text [TXT] [X] [boolean]'
        },
        {
          opcode: 'c',
          blockType: BlockType.BOOLEAN,
          text: 'block name'
        },
        {
          opcode: 'd',
          blockType: BlockType.HAT,
          isEdgeActivated: false,
          text: 'block name'
        }
      ]
    }
  }

a (args, util){
  const TXT = args.TXT;
  const X = args.X;
  const boolean = args.boolean;

  return this.write(`M0 \n`);
}

b (args, util){
  const TXT = args.TXT;
  const X = args.X;
  const boolean = args.boolean;

  return this.write(`M0 \n`);
}

c (args, util){

  return this.write(`M0 \n`);
}

d (args, util){

  return this.write(`M0 \n`);
}

}

module.exports = testExt;
