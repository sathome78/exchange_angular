import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {forkJoin, of} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

@Injectable()
export class NewsService {

  public HOST = environment.apiUrl;
  private rssUrls = [
    'https://ambcrypto.com/category/news/feed/',
    'https://coincodex.com/rss',
    'https://portaldobitcoin.com/feed',
    'https://feeds.feedburner.com/coinspeaker',
    'https://bitcoinerx.com/feed/',
    'https://coinspot.io/feed/',
  ];


  constructor(
    private http: HttpClient
  ) {
  }

  subscribeToPartnerNews(email: string) {
    // send email to back-end
    console.log('send to back' + email);
    return of(true);
  }

  getRssNews() {
    return forkJoin(
      this.rssUrls.map(url => this.rssRequest(url)));
  }

  rssRequest(url) {
    return this.http.get(url)
      .pipe(map((res: Response) => res.json()))
      .pipe(catchError(error => of(error)));
  }

  public mockXml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:atom="http://www.w3.org/2005/Atom"
	xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
	xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
	>

<channel>
	<title>News &#8211; AMBCrypto</title>
	<atom:link href="https://ambcrypto.com/category/news/feed/" rel="self" type="application/rss+xml" />
	<link>https://ambcrypto.com</link>
	<description>Stay Ahead With AMBCrypto</description>
	<lastBuildDate>Thu, 09 May 2019 10:30:09 +0000</lastBuildDate>
	<language>en-US</language>
	<sy:updatePeriod>hourly</sy:updatePeriod>
	<sy:updateFrequency>1</sy:updateFrequency>
	<generator>https://wordpress.org/?v=5.0.3</generator>
	<item>
		<title>Bitcoin Reorg: Could Binance have pulled it off and recovered hacked funds?</title>
		<link>https://ambcrypto.com/bitcoin-reorg-could-binance-have-pulled-it-off-and-recovered-hacked-funds/</link>
		<comments>https://ambcrypto.com/bitcoin-reorg-could-binance-have-pulled-it-off-and-recovered-hacked-funds/#respond</comments>
		<pubDate>Thu, 09 May 2019 10:00:40 +0000</pubDate>
		<dc:creator><![CDATA[Akash Girimath]]></dc:creator>
				<category><![CDATA[Bitcoin]]></category>
		<category><![CDATA[News]]></category>
		<category><![CDATA[Social]]></category>
		<category><![CDATA[Trading View]]></category>
		<category><![CDATA[Binance]]></category>
		<category><![CDATA[BTC]]></category>
		<category><![CDATA[Changpeng Zhao]]></category>
		<category><![CDATA[CZ]]></category>
		<category><![CDATA[news]]></category>

		<guid isPermaLink="false">https://ambcrypto.com/?p=86731</guid>
		<description><![CDATA[<p>One of the world&#8217;s largest exchanges, Binance, was hacked. According to an official statement, about $41 million worth Bitcoin [7,000 BTC] was lost in this hack. According to CZ, the hackers were careful and patient in executing the hack, which let them get access and details to multiple user accounts. All the Bitcoins gathered from [&#8230;]</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/bitcoin-reorg-could-binance-have-pulled-it-off-and-recovered-hacked-funds/" data-wpel-link="internal">Bitcoin Reorg: Could Binance have pulled it off and recovered hacked funds?</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></description>
				<content:encoded><![CDATA[<p>One of the world&#8217;s largest exchanges, Binance, was hacked. According to an official statement, about $41 million worth Bitcoin [7,000 BTC] was lost in this hack. According to CZ, the hackers were careful and patient in executing the hack, which let them get access and details to multiple user accounts. All the Bitcoins gathered from these accounts were sent out in one transaction.</p>
<p>A very small percentage of the Twitter community suggested that CZ could reorg [chain reorganization] the Bitcoin network to recover those stolen BTCs. Jeremy Rubin tweeted,</p>
<blockquote class="twitter-tweet" data-width="550" data-dnt="true">
<p lang="en" dir="ltr"><a href="https://twitter.com/cz_binance?ref_src=twsrc%5Etfw" data-wpel-link="external" target="_blank" rel="external noopener noreferrer">@cz_binance</a> if you reveal your private keys for the hacked coins (or a subset of them) you can decentralized-ly at zero cost to you, coordinate a reorg to undo the theft.</p>
<p>&mdash; Jeremy Rubin (@JeremyRubin) <a href="https://twitter.com/JeremyRubin/status/1125919526485254144?ref_src=twsrc%5Etfw" data-wpel-link="external" target="_blank" rel="external noopener noreferrer">May 8, 2019</a></p></blockquote>
<p><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></p>
<p>A few hours later, in a previously scheduled AMA, CZ addressed this tweet and said that he would consider doing a reorg. Subsequently, most people in the community objected to a reorg. Subsequently, CZ tweeted that he would not be going forward with the reorg idea.</p>
<h3><strong>What is a &#8216;Reorg?&#8217;</strong></h3>
<p>According to Bitcoin forums, &#8220;A blockchain reorganize (or reorg) happens when one chain becomes longer than the one you are currently working on. All of the blocks in the old chain that are not in the new one become orphan blocks, and their generations are invalidated. Transactions that use the newly invalid generated coins also become invalid.&#8221;</p>
<p>In this hypothetical scenario, CZ/Binance would incentivize gathered miners/mining pool by paying them BTCs to reorg the chain, i.e, manually create a second chain and invalidate the chain which recorded transactions of the hackers.</p>
<h3>A Brief <a href="https://en.bitcoin.it/wiki/Common_Vulnerabilities_and_Exposures#Value_overflow" target="_blank" rel="noopener external noreferrer" data-wpel-link="external">History</a> of Bitcoin&#8217;s reorgs</h3>
<p>There are have been other instances in Bitcoin&#8217;s history where reorgs have reared their heads,</p>
<ol>
<li><a href="https://bitcointalk.org/index.php?topic=822.0" target="_blank" rel="noopener external noreferrer" data-wpel-link="external">August 15, 2010</a>: Value Overflow/Integer Overflow Bug caused the software to think that the transaction contained only a small amount of BTC, while in reality the outputs together had thousands of times more than the 21 million that should ever exist. A new version of the Bitcoin software had to be published, the blockchain was forked, and a new, valid chain overtook the old one at block 74691 – 53 blocks after the original fork.</li>
<li><a href="https://bitcoinmagazine.com/articles/bitcoin-network-shaken-by-blockchain-fork-1363144448/" target="_blank" rel="noopener external noreferrer" data-wpel-link="external">March 11, 2013</a>: When Bitcoin upgraded from version 0.7 to 0.8, it caused the chain to split into two and the chain went on until 25 blocks. The reorg was spotted and reverted back. This is considered as the biggest reorg in Bitcoin history.</li>
<li><a href="https://www.reddit.com/r/Bitcoin/comments/4vupa6/p2shinfo_shows_movement_out_of_multisig_wallets/d61qyaj/" target="_blank" rel="noopener external noreferrer" data-wpel-link="external">August 2016</a>: Reorg was suggested by many in the community when Bitfinex suffered a hack of 120,000 BTC. However, the reorg suggestion failed.</li>
</ol>
<h3>Can Binance execute a successful reorg?</h3>
<p>The reorg to recover the stolen or hacked funds gets more expensive as more blocks are mined after the hack. Moreover, the reorg also depends on the incentives the miners need to receive, which in turn, depends on the mining reward. Additionally, the security model of Bitcoin rests on economic incentives which prevent miners from working on large reorgs. Further, these economic incentives tend to cease when the possibility of gain is much higher than the usual miner rewards, and if this was possible,</p>
<ul>
<li>it would require massive hashrate to execute a reorg.</li>
<li>it would put a dent on/in Bitcoin &#8220;decentralized&#8221; network.</li>
</ul>
<p>Due to these reasons, the community opposed the reorg of the Bitcoin network and it is the same reason why the community is set against reorg for Binance&#8217;s loss of 7,000 BTCs. Also, organizing a cumulative hash power of 51% or higher is easier said than done. Jimmy Song, a well-known Bitcoin developer, put out a thread on Twitter detailing how expensive and tedious a reorg would be.</p>
<blockquote class="twitter-tweet" data-width="550" data-dnt="true">
<p lang="en" dir="ltr">1/ Back of the envelope math for doing a 58 block reorg (current confirmations for the tx that took money from binance):</p>
<p>Minimal cost: 58 * 12.5 btc = 725 BTC (assumes every miner would get roughly the same tx fees in the new chain and that 100% of miners go with this scheme)</p>
<p>&mdash; Jimmy Song (송재준) (@jimmysong) <a href="https://twitter.com/jimmysong/status/1125977497047314432?ref_src=twsrc%5Etfw" data-wpel-link="external" target="_blank" rel="external noopener noreferrer">May 8, 2019</a></p></blockquote>
<p><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></p>
<p>Assuming that CZ would be able to gather the hashrate required for the reorg, he would still need to make sure that every miner is informed and coordinated to know which &#8220;new&#8221; block to build on, which otherwise, would risk eruption of many chains. According to Song, it would take CZ/Binance 24 hours or 144 blocks to arrange for the hash power. Others were more pessimistic, with some even suggesting that reorging is only theoretically possible and under the present circumstances, it would take more than at least 75% of the hash power to even begin the reorg.</p>
<p>The hacked transaction was witnessed in block 575,012, whereas at press time, the ongoing block was 575,114, i.e., a difference of 102 blocks.</p>
<p>Even if he managed the above, the reorg would also face a challenge as the hackers could sweeten the deal for miners and thus, prevent the reorg from happening. Plus, it wouldn&#8217;t be economic for CZ.</p>
<p>The bottom line is, even if the reorg took place successfully, the idea of a &#8220;decentralized and immutable network&#8221; would be lost forever. Additionally, every exchange could undergo a reorg, if hacked, which would also destroy the chances of Bitcoin becoming a &#8220;store of value.&#8221;</p>
<h3>Crypto Community Reacts</h3>
<p>People from all around the crypto community, from Peter Wuille and Vitalik Buterin to Mike Novogratz, voiced their opinion on CZ&#8217;s idea to reorg the Bitcoin network. Most of the people in the community were outraged by the idea of a reorg. However, CZ clarified in subsequent tweets that reorg was an outlandish idea and that the exchange would not consider it.</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/bitcoin-reorg-could-binance-have-pulled-it-off-and-recovered-hacked-funds/" data-wpel-link="internal">Bitcoin Reorg: Could Binance have pulled it off and recovered hacked funds?</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></content:encoded>
			<wfw:commentRss>https://ambcrypto.com/bitcoin-reorg-could-binance-have-pulled-it-off-and-recovered-hacked-funds/feed/</wfw:commentRss>
		<slash:comments>0</slash:comments>
		</item>
		<item>
		<title>Ethereum [ETH] and Tron [TRX] Price Analysis: Impasse between bears and bulls stalls coins</title>
		<link>https://ambcrypto.com/ethereum-eth-and-tron-trx-price-analysis-impasse-between-bears-and-bulls-stall-coins/</link>
		<comments>https://ambcrypto.com/ethereum-eth-and-tron-trx-price-analysis-impasse-between-bears-and-bulls-stall-coins/#respond</comments>
		<pubDate>Thu, 09 May 2019 09:00:47 +0000</pubDate>
		<dc:creator><![CDATA[Biraajmaan Tamuly]]></dc:creator>
				<category><![CDATA[Altcoins]]></category>
		<category><![CDATA[Analysis]]></category>
		<category><![CDATA[Ethereum]]></category>
		<category><![CDATA[News]]></category>
		<category><![CDATA[Social]]></category>
		<category><![CDATA[Trading View]]></category>
		<category><![CDATA[ETH]]></category>
		<category><![CDATA[news]]></category>
		<category><![CDATA[PRICE ANALYSIS]]></category>
		<category><![CDATA[Tron]]></category>
		<category><![CDATA[TRX]]></category>

		<guid isPermaLink="false">https://ambcrypto.com/?p=86864</guid>
		<description><![CDATA[<p>Altcoins continued to push forward against bearish resistance in the market as Ethereum [ETH] and Tron [TRX] witnessed a minor hike and a minor fall, respectively.  At press time, Ethereum was rising by 1.27 percent against the US Dollar. The market capitalization recorded was around $18.2 billion, and the token was priced at $171.85. Tron [&#8230;]</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/ethereum-eth-and-tron-trx-price-analysis-impasse-between-bears-and-bulls-stall-coins/" data-wpel-link="internal">Ethereum [ETH] and Tron [TRX] Price Analysis: Impasse between bears and bulls stalls coins</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></description>
				<content:encoded><![CDATA[<p>Altcoins continued to push forward against bearish resistance in the market as Ethereum [ETH] and Tron [TRX] witnessed a minor hike and a minor fall, respectively.  At press time, Ethereum was rising by 1.27 percent against the US Dollar. The market capitalization recorded was around $18.2 billion, and the token was priced at $171.85.</p>
<p>Tron [TRX] continued to witnessed a decline and fell by 1.37 percent. The token was valued at $0.025 and the market cap remained at $1.62 billion. The trade volume recorded over the past 24 hours was positive, amounting to $731 million.</p>
<p><strong>Ethereum one-day chart</strong></p>
<div id="attachment_86866" style="width: 1284px" class="wp-caption aligncenter"><img class="wp-image-86866 size-full" src="https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/ETHEREmmm.png" alt="" width="1274" height="654" srcset="https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/ETHEREmmm.png 1274w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/ETHEREmmm-300x154.png 300w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/ETHEREmmm-768x394.png 768w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/ETHEREmmm-1024x526.png 1024w" sizes="(max-width: 1274px) 100vw, 1274px" /><p class="wp-caption-text">Source: <a href="https://www.tradingview.com/chart/sjUypcSp/" data-wpel-link="external" target="_blank" rel="external noopener noreferrer">Trading View</a></p></div>
<p>Ethereum&#8217;s [ETH] one-day chart suggested that its price was consolidating sideways between the resistance of $181.84 and the long term support of $122.46.  An uptrend extended the price from $140.08 to $181.27.</p>
<p>The <strong>Bollinger Bands</strong> indicated a volatile period for the coin as the bands were diverging on the chart.</p>
<p>The <strong>Fisher Transform</strong> indicated a bearish ride for the token since the red line was hovering over the blue line.</p>
<p>The <strong>MACD line</strong> was above the red line in the chart, pointing towards a bullish trend.</p>
<p><strong>Tron one-day chart</strong></p>
<div id="attachment_86865" style="width: 1284px" class="wp-caption aligncenter"><img class="wp-image-86865 size-full" src="https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/TRXXX.png" alt="" width="1274" height="654" srcset="https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/TRXXX.png 1274w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/TRXXX-300x154.png 300w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/TRXXX-768x394.png 768w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/TRXXX-1024x526.png 1024w" sizes="(max-width: 1274px) 100vw, 1274px" /><p class="wp-caption-text">Source: <a href="https://www.tradingview.com/chart/sjUypcSp/" data-wpel-link="external" target="_blank" rel="external noopener noreferrer">Trading View</a></p></div>
<p>Tron&#8217;s [TRX] one-day chart exhibited an uptrend which stretched the valuation from $0.0253 to $0.0307, followed by a downtrend from $0.0293 to $0.0251. Strong resistance remained at $0.0309 and the long-term support was at $0.0224.</p>
<p>The<strong> Parabolic SAR</strong> was bullish for the token as the dotted markers hovered below the candlesticks.</p>
<p>The<strong> Awesome Oscillator </strong>was a mix of both bearish and bullish momentum.</p>
<p>The <strong>Chaikin Money Flow </strong>line was below the zero line, implying that there was no capital flowing into the token&#8217;s market.</p>
<p><strong>Conclusion</strong></p>
<p>Indicators for both Ethereum and Tron remained predominantly split between bullish and bearish pressure.</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/ethereum-eth-and-tron-trx-price-analysis-impasse-between-bears-and-bulls-stall-coins/" data-wpel-link="internal">Ethereum [ETH] and Tron [TRX] Price Analysis: Impasse between bears and bulls stalls coins</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></content:encoded>
			<wfw:commentRss>https://ambcrypto.com/ethereum-eth-and-tron-trx-price-analysis-impasse-between-bears-and-bulls-stall-coins/feed/</wfw:commentRss>
		<slash:comments>0</slash:comments>
		</item>
		<item>
		<title>Basic Attention Token [BAT] tanks by 8% after hitting a price wall</title>
		<link>https://ambcrypto.com/basic-attention-token-bat-tanks-by-8-after-hitting-a-price-wall/</link>
		<comments>https://ambcrypto.com/basic-attention-token-bat-tanks-by-8-after-hitting-a-price-wall/#respond</comments>
		<pubDate>Thu, 09 May 2019 08:29:58 +0000</pubDate>
		<dc:creator><![CDATA[Akash Girimath]]></dc:creator>
				<category><![CDATA[Altcoins]]></category>
		<category><![CDATA[News]]></category>
		<category><![CDATA[Social]]></category>
		<category><![CDATA[Trading View]]></category>
		<category><![CDATA[basic attention token]]></category>
		<category><![CDATA[BAT]]></category>
		<category><![CDATA[Bitcoin]]></category>
		<category><![CDATA[BTC]]></category>
		<category><![CDATA[news]]></category>

		<guid isPermaLink="false">https://ambcrypto.com/?p=86896</guid>
		<description><![CDATA[<p>Basic Attention Token [BAT] tanked, despite the market rallying following Bitcoin&#8217;s surge. On the back of the token&#8217;s splendid performance in 2019, a massive correction wave hit BAT. The price of BAT, at press time, was $0.3112 and it had a market cap of $381 million. The price fell by 8.34% over 24 hours and [&#8230;]</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/basic-attention-token-bat-tanks-by-8-after-hitting-a-price-wall/" data-wpel-link="internal">Basic Attention Token [BAT] tanks by 8% after hitting a price wall</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></description>
				<content:encoded><![CDATA[<p>Basic Attention Token [BAT] tanked, despite the market rallying following Bitcoin&#8217;s surge. On the back of the token&#8217;s splendid performance in 2019, a massive correction wave hit BAT.</p>
<p>The price of BAT, at press time, was $0.3112 and it had a market cap of $381 million. The price fell by 8.34% over 24 hours and over a 7-day time frame, the price declined by 23%. However, the YTD change in prices was a positive 153%.</p>
<div id="attachment_86911" style="width: 1284px" class="wp-caption aligncenter"><img class="wp-image-86911 size-full" src="https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/download-1-2.png" alt="" width="1274" height="590" srcset="https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/download-1-2.png 1274w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/download-1-2-300x139.png 300w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/download-1-2-768x356.png 768w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/download-1-2-1024x474.png 1024w" sizes="(max-width: 1274px) 100vw, 1274px" /><p class="wp-caption-text">Source: <a href="https://tradingview.com/symbols/BATUSD/" target="_blank" rel="noopener external noreferrer" data-wpel-link="external">TradingView</a></p></div>
<p>The 24-hour volume saw a fall from $42 million to $36 million. At the time of writing, the 24-hour volume was $36 million and most of the trading volume was coming from ZB.COM via BAT/USDT. The said exchange contributed 22% of the total trading volume i.e., $8.2 million. CoinBene followed ZB.COM, contributing $4 million via BAT/BTC.</p>
<p>Although BAT has performed well in the past when compared to other altcoins, its uptrend seems to have hit a roadblock. The price of BAT hit a peak on April 21, and it has been on a downtrend ever since. It has fallen by approximately 35% since.</p>
<p>The recent update in the BAT ecosystem was Brave browser updating its Ads feature. The update to the browser was announced two weeks ago. Further, the token has performed better than the third largest cryptocurrency, XRP, in 2019.</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/basic-attention-token-bat-tanks-by-8-after-hitting-a-price-wall/" data-wpel-link="internal">Basic Attention Token [BAT] tanks by 8% after hitting a price wall</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></content:encoded>
			<wfw:commentRss>https://ambcrypto.com/basic-attention-token-bat-tanks-by-8-after-hitting-a-price-wall/feed/</wfw:commentRss>
		<slash:comments>0</slash:comments>
		</item>
		<item>
		<title>Bitcoin SV [BSV] surges by 9.23% over the day as Binance Coin [BNB] slips</title>
		<link>https://ambcrypto.com/bitcoin-sv-bsv-surges-by-9-23-over-the-day-as-binance-coin-bnb-slips/</link>
		<comments>https://ambcrypto.com/bitcoin-sv-bsv-surges-by-9-23-over-the-day-as-binance-coin-bnb-slips/#respond</comments>
		<pubDate>Thu, 09 May 2019 07:24:04 +0000</pubDate>
		<dc:creator><![CDATA[Namrata Shukla]]></dc:creator>
				<category><![CDATA[Altcoins]]></category>
		<category><![CDATA[Analysis]]></category>
		<category><![CDATA[News]]></category>
		<category><![CDATA[Social]]></category>
		<category><![CDATA[Trading View]]></category>
		<category><![CDATA[BSV]]></category>
		<category><![CDATA[news]]></category>

		<guid isPermaLink="false">https://ambcrypto.com/?p=86882</guid>
		<description><![CDATA[<p>The cryptocurrency market is slowly recovering from one of the largest cryptocurrency exchanges in the world, Binance, being hacked. The price of Binance [BNB] plunged on May 9. However, its rival coin, Bitcoin SV [BSV], appeared to be soaring. Bitcoin SV saw a major price rise over the past day, after stagnating for a while. [&#8230;]</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/bitcoin-sv-bsv-surges-by-9-23-over-the-day-as-binance-coin-bnb-slips/" data-wpel-link="internal">Bitcoin SV [BSV] surges by 9.23% over the day as Binance Coin [BNB] slips</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></description>
				<content:encoded><![CDATA[<p>The cryptocurrency market is slowly recovering from one of the largest cryptocurrency exchanges in the world, Binance, being hacked. The price of Binance [BNB] plunged on May 9. However, its rival coin, Bitcoin SV [BSV], appeared to be soaring. Bitcoin SV saw a major price rise over the past day, after stagnating for a while.</p>
<div id="attachment_86884" style="width: 1300px" class="wp-caption aligncenter"><img class="wp-image-86884 size-full" src="https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/BSVCMC.jpg" alt="Source: CoinMarketCap " width="1290" height="626" srcset="https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/BSVCMC.jpg 1290w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/BSVCMC-300x146.jpg 300w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/BSVCMC-768x373.jpg 768w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/BSVCMC-1024x497.jpg 1024w" sizes="(max-width: 1290px) 100vw, 1290px" /><p class="wp-caption-text">Source: CoinMarketCap</p></div>
<p>At press time, BSV was valued at $57.73 with a market cap of $1.02 billion. The 24-hour trading volume was reported to be $147 million, while noting a rise of 9.23% over the past day. This was a major pump for the coin since its slump. The coin soared by 8.10% over the past seven days, but fell by 0.68% over the past hour.</p>
<div id="attachment_86883" style="width: 1284px" class="wp-caption aligncenter"><img class="wp-image-86883 size-full" src="https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/BSV1h.png" alt="Source: Trading view " width="1274" height="626" srcset="https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/BSV1h.png 1274w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/BSV1h-300x147.png 300w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/BSV1h-768x377.png 768w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/BSV1h-1024x503.png 1024w" sizes="(max-width: 1274px) 100vw, 1274px" /><p class="wp-caption-text">Source: <a href="https://www.tradingview.com/symbols/BNBUSD/" target="_blank" rel="noopener external noreferrer" data-wpel-link="external">TradingView</a></p></div>
<p>However, BSV started to fall immediately after noting a sudden hike and plunged by 3.42% since. Since BSV was delisted from various major exchanges, it was highly traded on Huobi Global with BSV/USDT pair and noted a volume of $14 million. The second place was taken by ZBG, reporting a trading volume of $13.77 million with BSV/USDT pair. ZBG was followed by 55Global Market as it registered $13.23 million in volume with BSV/USDT pair. All top three trades for the coin were carried out with USDT pair.</p>
<p>This rise in price came a day after Changpeng Zhao aka CZ, Binance&#8217;s CEO, announced funding the legal fees of those who are being sued by Craig Wright. The CEO said,</p>
<blockquote><p>&#8220;CSW is picking on the people who have a hard time fronting their legal fees. How about we do a @BinanceBCF charity program to raise money from the community for legal fees for anyone CSW sues?&#8221;</p></blockquote>
<p>After the tweet, the exchange was hacked and Binance coin [BNB] plunged.</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/bitcoin-sv-bsv-surges-by-9-23-over-the-day-as-binance-coin-bnb-slips/" data-wpel-link="internal">Bitcoin SV [BSV] surges by 9.23% over the day as Binance Coin [BNB] slips</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></content:encoded>
			<wfw:commentRss>https://ambcrypto.com/bitcoin-sv-bsv-surges-by-9-23-over-the-day-as-binance-coin-bnb-slips/feed/</wfw:commentRss>
		<slash:comments>0</slash:comments>
		</item>
		<item>
		<title>Facebook is Pro-Crypto: Social media giant lifts ban on cryptocurrency and blockchain ads</title>
		<link>https://ambcrypto.com/facebook-is-pro-crypto-social-media-giant-lifts-ban-on-cryptocurrency-and-blockchain-ads/</link>
		<comments>https://ambcrypto.com/facebook-is-pro-crypto-social-media-giant-lifts-ban-on-cryptocurrency-and-blockchain-ads/#respond</comments>
		<pubDate>Thu, 09 May 2019 06:50:32 +0000</pubDate>
		<dc:creator><![CDATA[Biraajmaan Tamuly]]></dc:creator>
				<category><![CDATA[News]]></category>
		<category><![CDATA[Social]]></category>
		<category><![CDATA[Trading View]]></category>
		<category><![CDATA[Facebook coin]]></category>
		<category><![CDATA[news]]></category>

		<guid isPermaLink="false">https://ambcrypto.com/?p=86879</guid>
		<description><![CDATA[<p>Facebook, the largest social media giant, made news after it announced that it would launch its own cryptocurrency, Facebook Coin. It was also rumored that Facebook was looking out for VC firms to invest in their cryptocurrency project, with the targeted sum being &#8220;as much as $1 billion.&#8221; Now, according to an official announcement, Facebook [&#8230;]</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/facebook-is-pro-crypto-social-media-giant-lifts-ban-on-cryptocurrency-and-blockchain-ads/" data-wpel-link="internal">Facebook is Pro-Crypto: Social media giant lifts ban on cryptocurrency and blockchain ads</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></description>
				<content:encoded><![CDATA[<p>Facebook, the largest social media giant, made news after it announced that it would launch its own cryptocurrency, Facebook Coin. It was also rumored that Facebook was looking out for VC firms to invest in their cryptocurrency project, with the targeted sum being &#8220;as much as $1 billion.&#8221;</p>
<p>Now, according to an official <a href="https://www.facebook.com/business/news/updating-our-ad-policies-for-financial-services-and-products/" data-wpel-link="external" target="_blank" rel="external noopener noreferrer">announcement</a>, Facebook is going to lift its ban on cryptocurrency and blockchain related ads on its platform.</p>
<p>The statement read,</p>
<blockquote><p>&#8220;Starting 5 June, we will update our Prohibited Financial Products and Services Policy to no longer allow ads promoting contracts for difference [CFDs], complex financial products that are often associated with predatory behaviour. These products, due to their complexity, often mislead people.&#8221;</p></blockquote>
<p>Facebook had implemented the ban on cryptocurrency ads and promotional campaigns related to blockchains and ICOs back in January 2018. It was believed that the ban was to tackle concerns that users may get misled by fraudulent investments and spend their capital on initial coin offerings offered by unreliable cryptocurrency start-ups.</p>
<p>However, the announcement itself did not list the reason behind Facebook&#8217;s u-turn on such ads. Many speculate that the current development is in keeping with the release of their own virtual asset, motivating them to change their stance on ads regarding cryptocurrency and blockchain on social media.</p>
<p>However, the announcement clarified that the social media platform will continue to ban ads for ICOs and binary options.</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/facebook-is-pro-crypto-social-media-giant-lifts-ban-on-cryptocurrency-and-blockchain-ads/" data-wpel-link="internal">Facebook is Pro-Crypto: Social media giant lifts ban on cryptocurrency and blockchain ads</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></content:encoded>
			<wfw:commentRss>https://ambcrypto.com/facebook-is-pro-crypto-social-media-giant-lifts-ban-on-cryptocurrency-and-blockchain-ads/feed/</wfw:commentRss>
		<slash:comments>0</slash:comments>
		</item>
		<item>
		<title>Bitcoin crosses $6,000 mark on major exchanges despite FUD in crypto community</title>
		<link>https://ambcrypto.com/bitcoin-crosses-6000-mark-on-major-exchanges-despite-fud-in-crypto-community/</link>
		<comments>https://ambcrypto.com/bitcoin-crosses-6000-mark-on-major-exchanges-despite-fud-in-crypto-community/#respond</comments>
		<pubDate>Thu, 09 May 2019 05:38:41 +0000</pubDate>
		<dc:creator><![CDATA[Akash Girimath]]></dc:creator>
				<category><![CDATA[Bitcoin]]></category>
		<category><![CDATA[News]]></category>
		<category><![CDATA[Social]]></category>
		<category><![CDATA[Trading View]]></category>
		<category><![CDATA[BTC]]></category>
		<category><![CDATA[news]]></category>

		<guid isPermaLink="false">https://ambcrypto.com/?p=86868</guid>
		<description><![CDATA[<p>Bitcoin reclaimed its $100 billion market cap recently and despite the Binance hack yesterday, the price of Bitcoin crossed the $6,000 mark. The price of Bitcoin at press time was $6078, and it had a market cap of $107 billion. Bullish Trend of Bitcoin According to CoinMarketCap, Bitcoin&#8217;s price has turned bullish over both, the [&#8230;]</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/bitcoin-crosses-6000-mark-on-major-exchanges-despite-fud-in-crypto-community/" data-wpel-link="internal">Bitcoin crosses $6,000 mark on major exchanges despite FUD in crypto community</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></description>
				<content:encoded><![CDATA[<p>Bitcoin reclaimed its $100 billion market cap recently and despite the Binance hack yesterday, the price of Bitcoin crossed the $6,000 mark. The price of Bitcoin at press time was $6078, and it had a market cap of $107 billion.</p>
<h3>Bullish Trend of Bitcoin</h3>
<div id="attachment_86869" style="width: 869px" class="wp-caption aligncenter"><img class="wp-image-86869 size-full" src="https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/Capture-7.png" alt="" width="859" height="449" srcset="https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/Capture-7.png 859w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/Capture-7-300x157.png 300w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/Capture-7-768x401.png 768w" sizes="(max-width: 859px) 100vw, 859px" /><p class="wp-caption-text">Source: CoinMarketCap</p></div>
<p>According to CoinMarketCap, Bitcoin&#8217;s price has turned bullish over both, the smaller and larger time frames.</p>
<p>24-hour: 3.51%<br />
7-day: 12.34%<br />
YTD: 62.13%</p>
<p>The above is an indication of Bitcoin being on a positive trend since the beginning of 2019. Bitcoin has shown more than a few bullish confirmations, which explain the rally above the $6,000 mark. Bitcoin&#8217;s prices in the $6,000 range were last seen on November 14, 2018. However, the prices soon fell by a massive 45% in over 5 days.</p>
<h3><a href="https://ambcrypto.com/bitcoin-btcs-golden-cross-theory-the-bottom-for-bitcoin-is-closer-than-expected/" target="_blank" rel="noopener" data-wpel-link="internal">Golden Cross</a></h3>
<p>Bitcoin&#8217;s prices showed the formation of a Golden Cross on April 22, following which, the whole sentiment of the community turned bullish.</p>
<h3><a href="https://ambcrypto.com/bitcoins-barr-pattern-provides-bullish-confirmation-btc-price-might-hit-6100-soon/" target="_blank" rel="noopener" data-wpel-link="internal">BARR Pattern</a></h3>
<p>BARR Pattern indicates the reversal of a trend. In Bitcoin&#8217;s case, it was the end of a downtrend and the start of an uptrend which hopefully, would be a long-term trend.</p>
<div id="attachment_86870" style="width: 1284px" class="wp-caption aligncenter"><img class="wp-image-86870 size-full" src="https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/download-7.png" alt="" width="1274" height="590" srcset="https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/download-7.png 1274w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/download-7-300x139.png 300w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/download-7-768x356.png 768w, https://ambcrypto.sfo2.digitaloceanspaces.com/2019/05/download-7-1024x474.png 1024w" sizes="(max-width: 1274px) 100vw, 1274px" /><p class="wp-caption-text">Source: TradingView</p></div>
<h3><strong>Is this the &#8220;Bull Rally?&#8221;</strong></h3>
<p>Bitcoin&#8217;s price is set to face massive resistance between $6,100 and $6.500, a price range which acted as a support for the prices for almost 3/4th of 2018. Although this rally might seem like the end of the bear market and the start of a bull rally, it can only be confirmed after the prices close above $6,500.</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/bitcoin-crosses-6000-mark-on-major-exchanges-despite-fud-in-crypto-community/" data-wpel-link="internal">Bitcoin crosses $6,000 mark on major exchanges despite FUD in crypto community</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></content:encoded>
			<wfw:commentRss>https://ambcrypto.com/bitcoin-crosses-6000-mark-on-major-exchanges-despite-fud-in-crypto-community/feed/</wfw:commentRss>
		<slash:comments>0</slash:comments>
		</item>
		<item>
		<title>Bitcoin [BTC] is not in a bull run, but it is definitely in the last phase of bear market, claims Tuur Demeester</title>
		<link>https://ambcrypto.com/bitcoin-btc-is-not-in-a-bull-run-but-it-is-definitely-in-the-last-phase-of-bear-market-claims-tuur-demeester/</link>
		<comments>https://ambcrypto.com/bitcoin-btc-is-not-in-a-bull-run-but-it-is-definitely-in-the-last-phase-of-bear-market-claims-tuur-demeester/#respond</comments>
		<pubDate>Thu, 09 May 2019 01:30:08 +0000</pubDate>
		<dc:creator><![CDATA[Biraajmaan Tamuly]]></dc:creator>
				<category><![CDATA[Bitcoin]]></category>
		<category><![CDATA[News]]></category>
		<category><![CDATA[Social]]></category>
		<category><![CDATA[news]]></category>

		<guid isPermaLink="false">https://ambcrypto.com/?p=86820</guid>
		<description><![CDATA[<p>In a recent interview with Peter McCormack on Whatbitcoindid podcast, Tuur Demeester spoke about Bitcoin&#8217;s current market situation and the various aspects that impact the virtual asset&#8217;s market. Tuur spoke about the Bitcoin&#8217;s current valuation and indicated that it was presently dictated by the accumulation of Bitcoin. He stated that the market was in a [&#8230;]</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/bitcoin-btc-is-not-in-a-bull-run-but-it-is-definitely-in-the-last-phase-of-bear-market-claims-tuur-demeester/" data-wpel-link="internal">Bitcoin [BTC] is not in a bull run, but it is definitely in the last phase of bear market, claims Tuur Demeester</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></description>
				<content:encoded><![CDATA[<p>In a recent interview with Peter McCormack on Whatbitcoindid podcast, Tuur Demeester spoke about Bitcoin&#8217;s current market situation and the various aspects that impact the virtual asset&#8217;s market.</p>
<p>Tuur spoke about the Bitcoin&#8217;s current valuation and indicated that it was presently dictated by the accumulation of Bitcoin. He stated that the market was in a state of battle between the bears and bulls where the sellers are looking at how many Bitcoins are left in ICO treasuries. He believed that till the time Bitcoin traded in the range under $6500, it would be indicative of an accumulation stage.</p>
<p>He added that the market might navigate through some painful maturation in the upcoming period, like the Mt. Gox situation. He explained that the concentration of the larger amount of Bitcoin [BTC] in exchanges, organizations which were looking forward to pooling the asset, is an extremely risky condition. In a situation where those coins were stolen or new regulators freeze the assets, it could drastically spook that market.</p>
<p>Tuur further expressed his sentiments and indicated that according to him, the market remained highly volatile. However, he believed that Bitcoin [BTC] remained in a secular bull market since the inception of the coin and hence, he did not prefer the idea considering the impact of &#8220;discount bullish scenario.&#8221;</p>
<p>He stated,</p>
<blockquote><p>&#8220;I am not ready to say yes, that we are in a new bull market but I do definitely think that we are in the last phase of the current bear market.&#8221;</p></blockquote>
<p>Additionally, Demeester stated that it was &#8220;dangerous&#8221; to rely on past patterns for future indications as the market can never be entirely replicated. The historical data based on technical analysis will only give the users hints of what situations might surface, but it is always based on a probability game.</p>
<p>Tuur emphasized that it was important that people do not rely on a single source of data like for example, only the price. Factors like long-term behavior, current market sentiments and retail activity in the market should also be considered.</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/bitcoin-btc-is-not-in-a-bull-run-but-it-is-definitely-in-the-last-phase-of-bear-market-claims-tuur-demeester/" data-wpel-link="internal">Bitcoin [BTC] is not in a bull run, but it is definitely in the last phase of bear market, claims Tuur Demeester</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></content:encoded>
			<wfw:commentRss>https://ambcrypto.com/bitcoin-btc-is-not-in-a-bull-run-but-it-is-definitely-in-the-last-phase-of-bear-market-claims-tuur-demeester/feed/</wfw:commentRss>
		<slash:comments>0</slash:comments>
		</item>
		<item>
		<title>Ex-Coinbase executive will now head Bitstamp&#8217;s U.S. operations</title>
		<link>https://ambcrypto.com/ex-coinbase-executive-will-now-head-bitstamps-u-s-operations/</link>
		<comments>https://ambcrypto.com/ex-coinbase-executive-will-now-head-bitstamps-u-s-operations/#respond</comments>
		<pubDate>Wed, 08 May 2019 23:30:45 +0000</pubDate>
		<dc:creator><![CDATA[Arijit Sarkar]]></dc:creator>
				<category><![CDATA[News]]></category>
		<category><![CDATA[Social]]></category>
		<category><![CDATA[Bitstamp]]></category>
		<category><![CDATA[Coinbase]]></category>
		<category><![CDATA[Hunter Merghart]]></category>
		<category><![CDATA[news]]></category>

		<guid isPermaLink="false">https://ambcrypto.com/?p=86807</guid>
		<description><![CDATA[<p>Bitstamp, Europe&#8217;s leading crypto exchange, gained prominence in the industry for providing simple and advanced trading options. The Luxembourg-based company made headlines again recently after it announced that Hunter Merghart, an ex-Coinbase executive, was going to lead its U.S. operations. The public announcement was made shortly after Bitstamp acquired a BitLicense, allowing the exchange to offer Bitcoin [BTC], [&#8230;]</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/ex-coinbase-executive-will-now-head-bitstamps-u-s-operations/" data-wpel-link="internal">Ex-Coinbase executive will now head Bitstamp&#8217;s U.S. operations</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></description>
				<content:encoded><![CDATA[<p>Bitstamp, Europe&#8217;s leading crypto exchange, gained prominence in the industry for providing simple and advanced trading options. The Luxembourg-based company made headlines again recently after it announced that Hunter Merghart, an ex-Coinbase executive, was going to lead its U.S. operations.</p>
<p>The public announcement was made shortly after Bitstamp acquired a BitLicense, allowing the exchange to offer Bitcoin [BTC], Litecoin [LTC], Bitcoin cash [BCH], Ether [ETH] and XRP trading pairs to U.S. residents. Nejc Kodrič, CEO of Bitstamp, remarked,</p>
<blockquote><p>&#8220;Merghart is the perfect person to lead our U.S. operations, which includes making sure our retail and institutional investors have a platform and service that is equal to what they would find at any traditional exchange anywhere in the world.&#8221;</p></blockquote>
<p>While Merghart was quick to update his bio on his Twitter handle, the <a href="https://www.coindesk.com/bitstamp-hires-ex-coinbase-trading-head-to-court-wall-street-money" data-wpel-link="external" target="_blank" rel="external noopener noreferrer">report</a> also highlighted his belief &#8220;in (Bitstamp&#8217;s) strategy&#8221; and his excitement &#8220;to help execute it.&#8221;</p>
<p>He further added,</p>
<blockquote><p>&#8220;This is an amazing opportunity for me to take what I’ve learned in both traditional finance and crypto to a larger role where I can help grow the U.S. business of the largest European crypto exchange.&#8221;</p></blockquote>
<p>In addition to Bitstamp&#8217;s strategy related to geographical expansion, the company also recently invested in a new matching engine and a surveillance platform from Cinnober, an IT provider for mainstream financial markets.</p>
<p>Although Merghart left Coinbase over the lack of resources and a lack of clarity about the company&#8217;s roadmap, experts speculate that Bitstamp&#8217;s entry into the U.S. market is poised to change the dynamics of the entire crypto ecosystem.</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/ex-coinbase-executive-will-now-head-bitstamps-u-s-operations/" data-wpel-link="internal">Ex-Coinbase executive will now head Bitstamp&#8217;s U.S. operations</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></content:encoded>
			<wfw:commentRss>https://ambcrypto.com/ex-coinbase-executive-will-now-head-bitstamps-u-s-operations/feed/</wfw:commentRss>
		<slash:comments>0</slash:comments>
		</item>
		<item>
		<title>Bitcoin [BTC] can finally get larger financial market exposure in 2019, claims Tuur Demeester</title>
		<link>https://ambcrypto.com/bitcoin-btc-can-finally-get-larger-financial-market-exposure-in-2019-claims-tuur-demeester/</link>
		<comments>https://ambcrypto.com/bitcoin-btc-can-finally-get-larger-financial-market-exposure-in-2019-claims-tuur-demeester/#respond</comments>
		<pubDate>Wed, 08 May 2019 21:30:25 +0000</pubDate>
		<dc:creator><![CDATA[Biraajmaan Tamuly]]></dc:creator>
				<category><![CDATA[Bitcoin]]></category>
		<category><![CDATA[News]]></category>
		<category><![CDATA[Social]]></category>
		<category><![CDATA[news]]></category>

		<guid isPermaLink="false">https://ambcrypto.com/?p=86755</guid>
		<description><![CDATA[<p>Since the beginning of 2019, Bitcoin [BTC] has witnessed a break from its price trends over the long term crypto winter of 2018. Bitcoin has recovered around 50% of its value since the start of 2019 and at press time, was priced at $5878.61. Such significant growth is an encouraging sign for Bitcoin&#8217;s future. In [&#8230;]</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/bitcoin-btc-can-finally-get-larger-financial-market-exposure-in-2019-claims-tuur-demeester/" data-wpel-link="internal">Bitcoin [BTC] can finally get larger financial market exposure in 2019, claims Tuur Demeester</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></description>
				<content:encoded><![CDATA[<p>Since the beginning of 2019, Bitcoin [BTC] has witnessed a break from its price trends over the long term crypto winter of 2018. Bitcoin has recovered around 50% of its value since the start of 2019 and at press time, was priced at $5878.61.</p>
<p>Such significant growth is an encouraging sign for Bitcoin&#8217;s future. In face, one popular crypto-proponent has commented that the price movement could indicate the beginning of accumulation.</p>
<p>Tuur Demeester, Founding Partner at Adamant Capital, stated that accumulation of Bitcoin started after the capitulation period in November. He mentioned there was a lot of positivity surrounding the market during that time and then, when capitulation took over and the prices were slashed, significant coin movements were recorded by Coinbase and other exchanges as well.</p>
<p>He stated that this was a very similar situation to that witnessed in 2015.</p>
<p>However, he conceded that market sentiment had changed and crypto users had moved on from hoping over capitulation to accumulation.</p>
<p>Tuur argued that the scenario was much more positive for Bitcoin [BTC] since large financial institutions were getting involved in the crypto space. New York Stock Exchange [NYSE] was going to own its own Bitcoin [BTC] platform, Fidelity was going to offer crypto trading in the next weeks, implying that Bitcoin would finally get real exposure to the larger financial market.</p>
<p>During the interview, Demeester was queried if the emergence of Altcoin ICOs affected the price of Bitcoin back in 2017. Tuur stated that Bitcoin was looked upon as a funding mechanism to get into exchanges in 2017. He said that the rapid price surge made him uncomfortable when Bitcoin went above the $5000 mark in mid-2017.</p>
<p>He believed that much of the mania which triggered the bull run to drive up the Bitcoin price was also due to the ICOs and rumors and speculations that emerged over that particular time period.</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/bitcoin-btc-can-finally-get-larger-financial-market-exposure-in-2019-claims-tuur-demeester/" data-wpel-link="internal">Bitcoin [BTC] can finally get larger financial market exposure in 2019, claims Tuur Demeester</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></content:encoded>
			<wfw:commentRss>https://ambcrypto.com/bitcoin-btc-can-finally-get-larger-financial-market-exposure-in-2019-claims-tuur-demeester/feed/</wfw:commentRss>
		<slash:comments>0</slash:comments>
		</item>
		<item>
		<title>Facebook Coin could triple crypto-user base, claims Blockchain Capital’s Bogart</title>
		<link>https://ambcrypto.com/facebook-coin-could-triple-crypto-user-base-claims-blockchain-capitals-bogart/</link>
		<comments>https://ambcrypto.com/facebook-coin-could-triple-crypto-user-base-claims-blockchain-capitals-bogart/#respond</comments>
		<pubDate>Wed, 08 May 2019 20:30:56 +0000</pubDate>
		<dc:creator><![CDATA[Aakash Athawasya]]></dc:creator>
				<category><![CDATA[News]]></category>
		<category><![CDATA[Social]]></category>
		<category><![CDATA[Trading View]]></category>
		<category><![CDATA[Blockchain Captial]]></category>
		<category><![CDATA[Facebook]]></category>
		<category><![CDATA[news]]></category>
		<category><![CDATA[Spencer Bogart]]></category>

		<guid isPermaLink="false">https://ambcrypto.com/?p=86782</guid>
		<description><![CDATA[<p>Facebook is on the verge of revolutionizing the world of digital payments. Blockchain Capital’s Spencer Bogart shed some light on the Menlo Park -based social media giant&#8217;s foray into electronic payments, ahead of next week’s Consensys 2019. In an interview with Bloomberg, the general partner at the blockchain-centric VC firm stated that in light of [&#8230;]</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/facebook-coin-could-triple-crypto-user-base-claims-blockchain-capitals-bogart/" data-wpel-link="internal">Facebook Coin could triple crypto-user base, claims Blockchain Capital’s Bogart</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></description>
				<content:encoded><![CDATA[<p>Facebook is on the verge of revolutionizing the world of digital payments. Blockchain Capital’s Spencer Bogart shed some light on the Menlo Park -based social media giant&#8217;s foray into electronic payments, ahead of next week’s Consensys 2019.</p>
<p>In an <a href="https://www.bloomberg.com/news/videos/2019-05-07/facebook-digital-coin-could-double-or-triple-crypto-users-blockchain-capital-video" data-wpel-link="external" target="_blank" rel="external noopener noreferrer"><strong>interview</strong></a> with Bloomberg, the general partner at the blockchain-centric VC firm stated that in light of the speculated “bottom” of the cryptocurrency market being reached, several catalysts are on the horizon. One, in particular, is the Facebook Coin project, which he described as “the elephant of the room.”</p>
<p>From a global perspective, the Facebook Coin project is incredibly significant as it operates along the same lines as the cryptocurrency industry. Given the universal dominance of the social media giant, and coupled with its crypto-esque digital payments project, Bitcoin and the larger virtual currency market could see a ‘trickle-down’ effect.</p>
<p>He added,</p>
<blockquote><p>&#8220;Facebook is significant from a global scale perspective, and even if a small percentage of those users trickle into crypto, we’re going to see a doubling or a tripling in the users base of crypto over the next couple years.&#8221;</p></blockquote>
<p>Using the phrase “gateway drug,” Bogart stressed that Facebook&#8217;s adoption push will introduce billions to the virtual currency market. Once initial public confidence is established, using Facebook’s fiat-backed coin, users can branch out and move on to Bitcoin and other cryptocurrencies.</p>
<p>Bogart added that “some percentage of the user base is likely to do so,” and this could be a “dramatic catalyst” to the decentralized currency industry.</p>
<p>From a long-term perspective, outside the obvious adoption success, Bogart stated that the Facebook Coin project is the initiator for something that has more overarching importance. This foray has “lit a fire in the pants” of several FinTech and financial institutions in the United States, Bogart added.</p>
<p>Referencing the introduction of crypto-centric services by the likes of Fidelity’s digital assets wing, ETrade, and TA Ameritrade, both on the institutional and retail front, the Blockchain Capital Partner suggested that Facebook sparked these companies into action by launching their Facebook Coin project.</p>
<p>The messaging giant’s headquarters for this payment project will be London, in addition to a smaller office in Dublin. Given their application is more popular in the UK over the US, Facebook decided to push the project from London. However, the first target for their payments project will be India, owing to the immense popularity of WhatsApp in the country.</p>
<p>The post <a rel="nofollow" href="https://ambcrypto.com/facebook-coin-could-triple-crypto-user-base-claims-blockchain-capitals-bogart/" data-wpel-link="internal">Facebook Coin could triple crypto-user base, claims Blockchain Capital’s Bogart</a> appeared first on <a rel="nofollow" href="https://ambcrypto.com" data-wpel-link="internal">AMBCrypto</a>.</p>
]]></content:encoded>
			<wfw:commentRss>https://ambcrypto.com/facebook-coin-could-triple-crypto-user-base-claims-blockchain-capitals-bogart/feed/</wfw:commentRss>
		<slash:comments>0</slash:comments>
		</item>
	</channel>
</rss>`;
}
